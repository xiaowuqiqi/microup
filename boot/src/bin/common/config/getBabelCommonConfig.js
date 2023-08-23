// const path = require("path");
const runtimeVersion = require('@babel/runtime/package.json').version;

const alias = require('./getAlias').babel;
// const babelImports = require('./getBabelImports');

module.exports = function babel({modules = 'auto', mode, browsers}) {
  const plugins = [
    [
      require.resolve('@babel/plugin-transform-typescript'),
      {isTSX: true},
    ],
    require.resolve('@babel/plugin-transform-object-assign'),
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {version: runtimeVersion},
    ],
    [
      require.resolve('@babel/plugin-transform-template-literals'),
      {loose: true},
    ],
    require.resolve('@babel/plugin-proposal-do-expressions'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      {legacy: true},
    ],
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('babel-plugin-lodash'),
    // ...Object.keys(babelImports).map((key) => [
    //   require.resolve('babel-plugin-import'),
    //   {
    //     libraryName: key,
    //     style: false,
    //   },
    //   babelImports[key][0],
    // ]),
  ];

  if (mode === 'compile') {
    plugins.push([
      require.resolve('babel-plugin-module-resolver'),
      {
        alias,
      },
    ]);
  }
  if (mode === 'boot-compile') {
    plugins.push([
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {'@': './src'},
      },
    ]);
  }

  return {
    presets: [
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers,
          },
          modules,
          exclude: [
            '@babel/plugin-proposal-dynamic-import',
          ],
          useBuiltIns: "entry",
          corejs: "3.29.1"
        },
      ],
    ],
    plugins,
  };
};
