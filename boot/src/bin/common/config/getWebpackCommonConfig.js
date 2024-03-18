import {join, resolve} from 'path';
import fs from 'fs';
import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import chalk from 'chalk';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import getBabelCommonConfig from './getBabelCommonConfig';
import getTSCommonConfig from './getTSCommonConfig';
import getExternalizeExposes from './getExternalizeExposes';
import {webpack as alias} from './getAlias';
import {generateEnvironmentVariable} from '../generateEnvironmentVariable';
import {context} from '@/store';
import ProjectConfig from "@/store/ProjectConfig";
import escapeWinPath from '@/utils/escapeWinPath';
import absolutePath from '@/utils/absolutePath';

const {ModuleFederationPlugin} = require('webpack').container;
const deps = require('../../../../package.json').dependencies;
/////
const jsFileName = '[name].[fullhash:8].js';
const jsChunkFileName = 'chunks/[name].[chunkhash:5].chunk.js';
const cssFileName = '[name].[contenthash:8].css';
const cssChunkFileName = 'chunks/[name].[contenthash:8].chunk.css';
const assetFileName = 'assets/[name].[hash:8][ext]';

function getFilePath(file) {
  const {option: {isDev, src}} = context;
  const filePath = resolve(file);
  if (fs.existsSync(filePath)) {
    return filePath;
  } else if (isDev) {
    return resolve(src, file);
  } else {
    return join(__dirname, '../../../', file);
  }
}

export default function getWebpackCommonConfig() {
  const {
    option: {mode, isDev, env, bootRootPath},
    projectConfig: {
      babelConfig, browsers, entryName, exposes, htmlTemplate, isPx2rem, favicon, swPath,
      output, theme, titlename,
      scopeName,
      sharedModules = {},
    },
  } = context;

  const entryPath = join(__dirname, '..', '..', '..', '..', 'tmp', `bootstrap.${entryName}.js`);
  //////// babel
  const babelOptions = babelConfig({
    ...getBabelCommonConfig({modules: 'commonjs', mode, browsers}),
    cacheDirectory: true,
    cacheCompression: false,
    compact: !isDev,
  }, mode, env);
  //////// ts
  const tsOptions = getTSCommonConfig();
  ////////
  let exposesByRoutes = ProjectConfig.getRoutes(context);
  exposesByRoutes = Object.keys(exposesByRoutes).reduce((obj, key) => {
    return Object.assign(obj, {['./' + key]: exposesByRoutes[key]})
  }, {});
  /////// env

  const {envStr, envData} = generateEnvironmentVariable();

  ///// 生产环境开启sourceMap，用于调试，默认关闭 , GENERATE_SOURCEMAP 从指令上传如值
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';

  //////// shared
  const shared = {};
  Object.entries(deps).forEach(([name, version]) => {
    // if (!babelImports[name]) {
    shared[name] = {
      // eager: true,
      singleton: true,
      requiredVersion: version,
    };
    // }
  });
  //////// less
  const lessOptions = {
    lessOptions: {
      // javascriptEnabled: true,
      // https://lesscss.org/features/#plugin-atrules-feature 建议使用@plugin
      modifyVars: theme,
    },
    sourceMap: isDev || shouldUseSourceMap
  }
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isDev && require.resolve('style-loader'),
      !isDev && MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                browsers,
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              require('postcss-normalize')({
                forceImport: true,
              }),
            ],
            sourceMap: isDev || shouldUseSourceMap,
          },
        },
      },
      isPx2rem && {
        loader: 'px2rem-loader',
        options: {
          sourceMap: isDev || shouldUseSourceMap,
          remUnit: 75,
          remPrecision: 8 // px转rem小数点保留的位置
        }
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(preProcessor);
    }
    return loaders;
  };
  //////////// moduleFederationPluginConfig
  const moduleFederationPluginConfig = {
    name: scopeName,
    library: {type: 'var', name: scopeName},
    filename: 'importManifest.js',
    exposes: {
      ...exposesByRoutes,
      // 暴露自己 如 intelligent:'./react/index.js'
      ...getExternalizeExposes(), // 暴露组件 externalize 注释那些
      ...exposes, // 用户配置进入的一些
    },
    // app1: 'app1@http://localhost:3001/remoteEntry.js',
    shared: [
      {
        ...shared,
        // '@microup/utils': {
        //   singleton: true,
        //   requiredVersion: false,
        // },
        ...sharedModules,
      },
    ],
  };

  return {
    mode: env,
    bail: !isDev, // 生产环境如果失败则停止webpack打包
    devtool: !isDev
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : 'cheap-module-source-map',
    entry: entryPath,
    output: {
      path: resolve(output),
      filename: jsFileName,
      chunkFilename: jsChunkFileName,
      // 生产环境所有服务统一在一个域名下边，所以通过 scopeName 区分服务，用nginx做代理
      // 而开发环境不需要代理
      publicPath: !isDev ? (scopeName === 'front' ? '/' : `${envData.STATIC_URL}/${scopeName}/`) : 'auto',
      // globalObject: 'this',
      // chunkFormat: 'module', // js 打成一个文件
      // clean: true, // 删除 dist 目录，建议提前输出容易删除output前就生成好的文件。
    },
    optimization: {
      minimize: !isDev,
      // splitChunks: {
      //   chunks: "all",
      //   cacheGroups: {
      //     styles: { // css 打成一个文件
      //       name: "styles",
      //       type: "css/mini-extract",
      //       chunks: "all",
      //     },
      //   },
      // },
      minimizer: [
        new TerserPlugin({
          extractComments: false, // 删除注释
          terserOptions: {
            parse: {
              ecma: 5,
            },
            compress: {
              ecma: 5,
              comparisons: true,
              inline: 2,
              drop_console: true,
              drop_debugger: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,// 删除注释
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
        // new ImageMinimizerPlugin({
        //   minimizer: {
        //     implementation: ImageMinimizerPlugin.imageminMinify,
        //     options: {
        //       // Lossless optimization with custom option
        //       // Feel free to experiment with options for better result for you
        //       plugins: [
        //         ["gifsicle", {interlaced: true}],
        //         ["jpegtran", {progressive: true}],
        //         // ["mozjpeg", { progressive: true, quality: 65 }],
        //         ["optipng", {optimizationLevel: 5}],
        //         // Svgo configuration here https://github.com/svg/svgo#configuration
        //         [
        //           "svgo",
        //           {
        //             plugins: {
        //               name: "preset-default",
        //               params: {
        //                 overrides: {
        //                   removeViewBox: false,
        //                   addAttributesToSVGElement: {
        //                     params: {
        //                       attributes: [
        //                         {xmlns: "http://www.w3.org/2000/svg"},
        //                       ],
        //                     },
        //                   },
        //                 },
        //               },
        //             },
        //           },
        //         ],
        //       ],
        //     },
        //   }
        // })
      ].filter(Boolean),
    },
    resolve: {
      mainFields: ['browser', 'main', 'module'],
      modules: ['node_modules', join(__dirname, '../../node_modules')],
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
      alias,
    },
    resolveLoader: {
      modules: ['node_modules', join(__dirname, '../../node_modules')],
      alias,
    },
    module: {
      strictExportPresence: true,
      noParse: [/moment.js/],
      rules: [
        {
          oneOf: [
            {
              test: /\.js$/,
              exclude: [/node_modules/],
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
            {
              test: [/\.(mjs|jsx)$/, ['pdfjs-dist'].map(module => new RegExp(`node_modules[/\\\\]${module}`))],
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
            {
              test: /\.tsx?$/,
              use: [{
                loader: require.resolve('babel-loader'),
                options: babelOptions,
              }, {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  compilerOptions: tsOptions,
                },
              }],
            },
          ],
        },
        {
          test: /\.worker\.(c|m)?js$/i,
          loader: require.resolve('worker-loader'),
          options: {
            // 带有fallback值的内联模式将为不支持web worker的浏览器创建文件，要禁用此行为只需使用no-fallback值。
            inline: 'no-fallback',
          },
        },
        {
          test: [
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
            /\.eot$/,
            /\.woff2?$/,
            /\.ttf$/,
            /\.svg$/,
            /\.mp3$/,
          ],
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024 // 4kb
            }
          },
          generator: {
            filename: assetFileName
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: /\.sprite\.svg$/,
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
            modules: {
              // auto: (resourcePath) => resourcePath.endsWith('module.less'),  // 匹配.less文件来进行css模块化。
              localIdentName: '[local]_[hash:base64:10]',
            },
            sourceMap: isDev || shouldUseSourceMap,
          }),
          sideEffects: true,
        },
        {
          oneOf: [{
            auto: (resourcePath) => resourcePath.endsWith('module.less'),  // 匹配.less文件来进行css模块化。
            localIdentName: `[local]_[hash:base64:10]`,
          }, false].map(autoModule => ({
            test: /\.less$/,
            use: getStyleLoaders({
              importLoaders: 3,
              modules: autoModule,
              sourceMap: isDev || shouldUseSourceMap,
            }, {
              loader: require.resolve('less-loader'),
              options: lessOptions,
            }),
            sideEffects: true,
          }))
        }
        // {
        //   test: /\.(scss|sass)$/,
        //   use: getStyleLoaders({
        //     importLoaders: 3,
        //     // sourceMap: isDevProduction
        //     //   ? shouldUseSourceMap
        //     //   : isDevDevelopment,
        //   }, {
        //     loader: require.resolve('sass-loader'),
        //     options: normalizeToSassVariables(lessOptions),
        //   }),
        //   sideEffects: true,
        // },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: process.env.TITLE_NAME || titlename,
        template: getFilePath(htmlTemplate),
        inject: true,
        favicon: getFilePath(favicon),
        env: envStr,
        // disableConsole: !isDev ? `<script>if(typeof console !=='undefined'){console.log=console.warn=function(){}}</script>` : '',
        minify: !isDev ? {
          html5: true, // 根据 HTML5 规范解析输入
          collapseWhitespace: true, // 折叠文档树中构成文本节点的空白区域
          removeComments: true, // 删除注释
          removeTagWhitespace: true, // 尽可能删除属性之间的空格。请注意，这将导致 HTML 无效！
          removeEmptyAttributes: true, // removeEmptyAttributes
          removeRedundantAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeScriptTypeAttributes: true,
        } : false,
      }),
      scopeName && new ModuleFederationPlugin(moduleFederationPluginConfig),
      new webpack.ProgressPlugin((percentage, msg, addInfo) => {
        // 进度条
        const stream = process.stderr;
        if (percentage < 0.75) {
          if (stream.isTTY) {
            stream.cursorTo(0);
            stream.write(`${chalk.magenta(msg)} (${chalk.magenta(addInfo)})`);
            stream.clearLine(1);
          } else {
            console.log(`bundleing! ${new Date()}`);
          }
        }
        if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'));
        }
      }),
      new FriendlyErrorsWebpackPlugin(),
      !isDev && new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      isDev && new webpack.HotModuleReplacementPlugin(),
      // isDev && new CaseSensitivePathsPlugin(), // 已删除因为性能差
      !isDev && new MiniCssExtractPlugin({
        filename: cssFileName,
        chunkFilename: cssChunkFileName,
      }),
      !isDev &&
      fs.existsSync(escapeWinPath(absolutePath(swPath))) &&
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: escapeWinPath(absolutePath(swPath)),
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/, /\.html/, /importManifest\.js/],
        //提高预设的最大大小(2mb);
        //减少延迟加载失败的可能性。
        //参见https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
      // webpack 在编译时 将你代码中的变量替换为其他值或表达式。
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        'process.env.PUBLIC_URL': JSON.stringify(bootRootPath),
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new WebpackBar({
        name: '(lll￢ω￢) microup',
        color: theme['primary-color'] || '#2979ff',
      }),
    ].filter(Boolean), // filter(Boolean) 过滤 null，undefined，false
  };
}
