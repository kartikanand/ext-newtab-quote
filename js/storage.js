import BrowserLocalStorage from "./browser-local-storage.js";
import ChromeExtensionStorage from "./chrome-ext-storage.js";

export default class Storage {
  constructor() {
    if (chrome?.storage?.local) {
      this.storage = new ChromeExtensionStorage();
    } else {
      this.storage = new BrowserLocalStorage();
    }
  }

  async load(key) {
    return this.storage.load(key);
  }

  async save(key, value) {
    await this.storage.save(key, value);
  }

  async clear() {
    await this.storage.clear();
  }
}
