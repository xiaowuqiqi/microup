import { defineConfig } from 'dumi';

export default defineConfig({
  // more father config: https://d.umijs.org/config
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'MU',
    footer: "Copyright © 2024 | Powered by <a href=\"https://d.umijs.org\" target=\"_blank\" rel=\"noreferrer\">dumi</a>",
  },
  lessLoader: {
    strictMath: 'always',
    modifyVars:{
      'primary-color': '#2979FF',
      'bg-color': '#fff',
      'info-color': '#2979FF',
      'warning-color': '#FD7D23',
      'success-color': '#1AB335',
      'error-color': '#F34C4B',
      'border-color': 'fade(#CBD2DC, 50%)',
      'text-color': '#12274D',
      'heading-color': '#12274D',
      'disabled-text-color': 'fade(@text-color, 45%)',
      'disabled-bg-color': 'fade(#F2F3F5 , 60)',
    }
  },
});
