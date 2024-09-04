export default class BrowserLocalStorage {
  constructor() {
    this.local = window.localStorage;
  }

  async load(key) {
    const jsonString = this.local.getItem(key);
    if (!jsonString || jsonString.length === 0) {
      return null;
    }

    return JSON.parse(jsonString);
  }

  async save(key, value) {
    this.local.setItem(key, JSON.stringify(value));
  }

  async clear() {
    this.local.clear();
  }
}
