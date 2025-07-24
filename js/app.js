/* eslint-disable no-restricted-globals */
import Model from "./model.js";
import NewTabView from "./newtab-view.js";
import SettingsView from "./settings-view.js";
import config from "./config.js";

// Controller class.
export default class App {
  constructor() {
    this.model = new Model();

    this.view =
      top.location.pathname === "/settings.html"
        ? new SettingsView(this)
        : new NewTabView(this);
  }

  async init() {
    await this.model.load();

    this.view.render();

    // TODO: Move to NewTabView
    if (top.location.pathname !== "/settings.html") {
      this.view.renderColorButtons({
        currentBGColor: this.model.getCurrentBGColor(),
        optionalBGColors: config.optionalBGColors,
      });

      this.handleRandomQuote();
    }
  }

  async handleAddQuote({ quote, author }) {
    this.model.addQuote(quote, author);
    if (top.location.pathname !== "/settings.html") {
      this.view.renderQuote({ quote, author });
    }
    await this.model.save();
  }

  // eslint-disable-next-line class-methods-use-this
  handleSettingsButtonClick() {
    // eslint-disable-next-line no-restricted-globals
    top.location.href = "/settings.html";
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
    if (top.location.pathname !== "/settings.html") {
      this.handleRandomQuote();
    }
  }

  async handleBGColorChange(currentBGColor) {
    await this.model.setCurrentBGColor(currentBGColor);

    this.view.renderColorButtons({
      currentBGColor: this.model.getCurrentBGColor(),
      optionalBGColors: config.optionalBGColors,
    });
  }
}
