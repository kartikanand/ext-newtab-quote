/* eslint-disable no-restricted-globals */
import View from "./view.js";
import Model from "./model.js";
import { createGradientFromColor, isSettingsPage } from "./shared.js";

// Controller class.
export default class App {
  constructor() {
    this.model = new Model();
    this.view = new View(this);
  }

  async init() {
    await this.model.load();

    // Apply background gradient to both pages
    const currentBGColor = this.model.getCurrentBGColor();
    const gradient = createGradientFromColor(currentBGColor);
    document.body.style.background = gradient;

    this.view.render();

    if (!isSettingsPage()) {
      this.view.renderColorButtons({
        currentBGColor: this.model.getCurrentBGColor(),
        optionalBGColors: this.model.config.optionalBGColors,
      });
      this.handleRandomQuote();
    }
  }

  async handleAddQuote({ quote, author }) {
    this.model.addQuote(quote, author);
    if (!isSettingsPage()) {
      this.view.renderQuote({ quote, author });
    }
    await this.model.save();
  }

  static handleSettingsButtonClick() {
    window.location.href = "/settings.html";
  }

  handleRandomQuote() {
    const randomQuote = this.model.getRandomQuote();
    this.view.renderQuote(randomQuote);
  }

  async handleDeleteAll() {
    await this.model.clear();
    this.model = new Model();
  }

  handleFileDownload() {
    this.model.downloadFile();
  }

  handleFileUpload() {
    this.model.uploadFile();
    if (!isSettingsPage()) {
      this.handleRandomQuote();
    }
  }

  async handleBGColorChange(currentBGColor) {
    await this.model.setCurrentBGColor(currentBGColor);
    const gradient = createGradientFromColor(currentBGColor);
    document.body.style.background = gradient;
    this.view.renderColorButtons({
      currentBGColor: this.model.getCurrentBGColor(),
      optionalBGColors: this.model.config.optionalBGColors,
    });
  }
}
