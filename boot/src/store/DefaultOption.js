import Item from "./Item";

const {EDefaultOption} = require("../default.config")

export default class DefaultOption extends Item {
  // process.env.NODE_ENV ||

  constructor(option, isDev) {
    super({
      ...EDefaultOption,
      ...option,
      env: isDev ? 'development' : 'production',
      isDev,
    });
  }
}
