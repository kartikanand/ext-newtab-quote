export default class ChromeExtensionStorage {
  constructor() {
    this.local = chrome.storage.local;
  }

  async load(key) {
    const data = await this.local.get(key);
    return data ? data[key] : null;
  }

  async save(key, value) {
    await this.local.set({ [key]: value });
  }

  async clear() {
    await this.local.clear();
  }
}
