import Item from "./Item";


export default class DevServerOptionsItem extends Item {

  constructor(devServerConfig) {
    super(devServerConfig);
  }

  static toData(devServerConfig) {
    (new DevServerOptionsItem(devServerConfig)).get()
  }
}


