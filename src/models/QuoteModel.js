import { defaultQuotes } from "../data/defaultQuotes.js";

const config = {
  optionalBGColors: ["#DBC4F0", "#A1CCD1", "#ACB1D6", "#AAC8A7"],
};

const createGradientFromColor = (color) => {
  const gradients = {
    "#DBC4F0": "linear-gradient(135deg, #DBC4F0 0%, #B8A9C9 100%)",
    "#A1CCD1": "linear-gradient(135deg, #A1CCD1 0%, #7FB3D3 100%)",
    "#ACB1D6": "linear-gradient(135deg, #ACB1D6 0%, #8B91C7 100%)",
    "#AAC8A7": "linear-gradient(135deg, #AAC8A7 0%, #88A085 100%)",
  };
  return (
    gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color} 100%)`
  );
};

class QuoteModel {
  constructor() {
    this.isExtension =
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync;
    this.model = {
      quotes: [...defaultQuotes],
      currentBGColor: config.optionalBGColors[0],
    };
    this.config = config;
    this.listeners = new Set();
  }

  // Event system for React components to listen to changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Storage methods
  async load() {
    try {
      const result = await this.get(["quotes", "currentBGColor"]);
      if (result.quotes && result.quotes.length > 0) {
        this.model.quotes = result.quotes;
      }
      if (result.currentBGColor) {
        this.model.currentBGColor = result.currentBGColor;
      }
      if (!result.quotes || result.quotes.length === 0) {
        // Initialize with default quotes if none exist
        await this.save();
      }
      this.notify();
    } catch (error) {
      console.error("Error loading quotes:", error);
    }
  }

  async save() {
    try {
      await this.set({
        quotes: this.model.quotes,
        currentBGColor: this.model.currentBGColor,
      });
      this.notify();
    } catch (error) {
      console.error("Error saving quotes:", error);
      throw error;
    }
  }

  async get(keys) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
      });
    } else {
      const result = {};
      keys.forEach((key) => {
        const value = localStorage.getItem(key);
        result[key] = value ? JSON.parse(value) : undefined;
      });
      return Promise.resolve(result);
    }
  }

  async set(data) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.sync.set(data, resolve);
      });
    } else {
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      return Promise.resolve();
    }
  }

  // Quote operations
  getRandomQuote() {
    const { quotes } = this.model;
    if (quotes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  getAllQuotes() {
    return [...this.model.quotes];
  }

  async addQuote(text, author) {
    const id = Date.now();
    const newQuote = { id, text, author };
    this.model.quotes.push(newQuote);
    await this.save();
    return newQuote;
  }

  async editQuote(id, text, author) {
    const quoteIndex = this.model.quotes.findIndex((q) => q.id === id);
    if (quoteIndex !== -1) {
      this.model.quotes[quoteIndex] = { id, text, author };
      await this.save();
      return this.model.quotes[quoteIndex];
    }
    throw new Error("Quote not found");
  }

  async deleteQuote(id) {
    const initialLength = this.model.quotes.length;
    this.model.quotes = this.model.quotes.filter((q) => q.id !== id);
    if (this.model.quotes.length < initialLength) {
      await this.save();
      return true;
    }
    return false;
  }

  async importQuotes(newQuotes) {
    // Add IDs to quotes that don't have them
    const quotesWithIds = newQuotes.map((quote) => ({
      ...quote,
      id: quote.id || Date.now() + Math.random(),
    }));

    this.model.quotes = [...this.model.quotes, ...quotesWithIds];
    await this.save();
  }

  exportQuotes() {
    return this.model.quotes.map((quote) => ({
      text: quote.text,
      author: quote.author,
    }));
  }

  async clear() {
    this.model.quotes = [...defaultQuotes];
    this.model.currentBGColor = config.optionalBGColors[0];
    await this.save();
  }

  // Background color methods
  getCurrentBGColor() {
    return this.model.currentBGColor;
  }

  async setCurrentBGColor(bgColor) {
    this.model.currentBGColor = bgColor;
    await this.save();
  }

  getBGColors() {
    return config.optionalBGColors;
  }

  createGradientFromColor(color) {
    return createGradientFromColor(color);
  }
}

// Create singleton instance
const quoteModel = new QuoteModel();
export default quoteModel;
