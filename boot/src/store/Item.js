export default class Item {
  data

  constructor(data) {
    this.data = data
  }

  get() {
    return this.data
  }

  hos() {
    return !!this.data
  }

  set(key, value) {
    this.data[key] = value
  }

}
