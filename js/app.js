import Model from "./model.js";
import View from "./view.js";
import config from "./config.js";

// Controller class.
export default class App {
  constructor() {
    this.model = new Model();
    this.view = new View({
      handleAddQuote: this.handleAddQuote.bind(this),
      handleRandomQuote: this.handleRandomQuote.bind(this),
      handleDeleteAll: this.handleDeleteAll.bind(this),
      handleFileDownload: this.handleFileDownload.bind(this),
      handleFileUpload: this.handleFileUpload.bind(this),
      handleBGColorChange: this.handleBGColorChange.bind(this),
    });
  }

  async init() {
    await this.model.load();

    this.view.render();

    this.view.renderColorButtons({
      currentBGColor: this.model.getCurrentBGColor(),
      optionalBGColors: config.optionalBGColors,
    });

    this.handleRandomQuote();
  }

  async handleAddQuote({ quote, author }) {
    this.model.addQuote(quote, author);
    this.view.renderQuote({ quote, author });
    await this.model.save();
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
    this.handleRandomQuote();
  }

  async handleBGColorChange(currentBGColor) {
    console.log("coming here");
    await this.model.setCurrentBGColor(currentBGColor);

    this.view.renderColorButtons({
      currentBGColor: this.model.getCurrentBGColor(),
      optionalBGColors: config.optionalBGColors,
    });
  }
}
