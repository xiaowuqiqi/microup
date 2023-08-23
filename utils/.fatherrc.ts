import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  // esm: { output: 'dist' },
  alias: {
    '@': './src',
  },
  esm: {
    output: 'lib',
  },
  extraBabelPresets: [
    require.resolve('@babel/preset-react'),
    [
      require.resolve('@babel/preset-env'),
      {
        modules: 'auto',
        exclude: [
          '@babel/plugin-proposal-dynamic-import', // 设置组件内部导出方式为import
        ],
      },
    ],
  ],
  extraBabelPlugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@umijs/babel-plugin-auto-css-modules'),
  ],
});
