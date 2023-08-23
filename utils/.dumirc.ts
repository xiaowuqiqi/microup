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
  },
});
