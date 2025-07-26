import { defaultQuotes } from "../data/defaultQuotes.js";

class StorageManager {
  constructor() {
    this.isExtension =
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const result = await this.get(["quotes"]);
    if (!result.quotes || result.quotes.length === 0) {
      await this.set({ quotes: defaultQuotes });
    }
    this.initialized = true;
  }

  async get(keys) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
      });
    } else {
      // Fallback to localStorage for standalone web app
      const result = {};
      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          const value = localStorage.getItem(key);
          result[key] = value ? JSON.parse(value) : undefined;
        });
      } else if (typeof keys === "string") {
        const value = localStorage.getItem(keys);
        result[keys] = value ? JSON.parse(value) : undefined;
      } else if (typeof keys === "object") {
        Object.keys(keys).forEach((key) => {
          const value = localStorage.getItem(key);
          result[key] = value ? JSON.parse(value) : keys[key];
        });
      }
      return Promise.resolve(result);
    }
  }

  async set(data) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.sync.set(data, resolve);
      });
    } else {
      // Fallback to localStorage for standalone web app
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      return Promise.resolve();
    }
  }
}

const storage = new StorageManager();
export default storage;
