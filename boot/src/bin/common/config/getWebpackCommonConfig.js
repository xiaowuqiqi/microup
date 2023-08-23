import {join, resolve} from 'path';
import fs from 'fs';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import chalk from 'chalk';
import postcssNormalize from 'postcss-normalize';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import getBabelCommonConfig from './getBabelCommonConfig';
import getTSCommonConfig from './getTSCommonConfig';
import getExternalizeExposes from './getExternalizeExposes';
import {webpack as alias} from './getAlias';
import {generateEnvironmentVariable} from '../generateEnvironmentVariable';
import {context} from '@/store';
import ProjectConfig from "@/store/ProjectConfig";

const {ModuleFederationPlugin} = require('webpack').container;
const deps = require('../../../../package.json').dependencies;

/////
const jsFileName = '[name].[fullhash:8].js';
const jsChunkFileName = 'chunks/[name].[chunkhash:5].chunk.js';
const cssFileName = '[name].[contenthash:8].css';
const cssChunkFileName = '[name].[contenthash:8].chunk.css';
const assetFileName = 'assets/[name].[hash:8].[ext]';
let processTimer;

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
    option: {mode, isDev, env},
    projectConfig: {
      babelConfig, browsers, entryName, exposes, htmlTemplate, isPx2rem, favicon,
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

  const envStr = generateEnvironmentVariable();

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
      javascriptEnabled: true,
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
            postcssNormalize(),
          ],
          sourceMap: isDev || shouldUseSourceMap,
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
    shared: [
      {
        ...shared,
        '@microup/utils': {
          singleton: true,
          requiredVersion: false,
        },
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
      path: !isDev ? resolve(output) : undefined,
      filename: jsFileName,
      chunkFilename: jsChunkFileName,
      globalObject: 'this',
    },
    optimization: {
      minimize: !isDev,
      minimizer: [new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 5,
          },
          compress: {
            ecma: 5,
            comparisons: true,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      })],
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
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: assetFileName,
          },
          exclude: /\.sprite\.svg$/,
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
              auto: (resourcePath) => resourcePath.endsWith('module.less'),  // 匹配.less文件来进行css模块化。
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
        disableConsole: !isDev ? `<script>if(typeof console !=='undefined'){console.log=console.warn=function(){}}</script>` : '',
        ...(!isDev ? {
          minify: {
            html5: true,
            collapseWhitespace: true,
            removeComments: true,
            removeTagWhitespace: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
          },
        } : undefined),
      }),
      scopeName && new ModuleFederationPlugin(moduleFederationPluginConfig),
      new webpack.ProgressPlugin((percentage, msg, addInfo) => {
        const stream = process.stderr;
        if (stream.isTTY) {
          if (stream.isTTY && percentage < 0.71) {
            stream.cursorTo(0);
            stream.write(`📦  ${chalk.magenta(msg)} (${chalk.magenta(addInfo)})`);
            stream.clearLine(1);
          } else if (percentage === 1) {
            // eslint-disable-next-line no-console
            console.log(chalk.green('\nwebpack: bundle build is now finished.'));
          }
        } else {
          const outputStr = '📦  bundleing!';
          if (percentage !== 1 && !processTimer) {
            // eslint-disable-next-line no-console
            console.log(`${outputStr}  ${new Date()}`);
            processTimer = setInterval(() => {
              // eslint-disable-next-line no-console
              console.log(`${outputStr}  ${new Date()}`);
            }, 1000 * 30);
          } else if (percentage === 1) {
            // eslint-disable-next-line no-console
            console.log(chalk.green('\nwebpack: bundle build is now finished.'));
            if (processTimer) {
              clearInterval(processTimer);
            }
          }
        }
      }),
      new FriendlyErrorsWebpackPlugin(),
      !isDev && new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      isDev && new webpack.HotModuleReplacementPlugin(),
      isDev && new CaseSensitivePathsPlugin(),
      !isDev && new MiniCssExtractPlugin({
        filename: cssFileName,
        chunkFilename: cssChunkFileName,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new WebpackBar({
        name: '🚚  microup',
        color: theme['primary-color'] || '#2979ff',
      }),
    ].filter(Boolean),
  };
}
