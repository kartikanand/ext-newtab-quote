import config from "./config.js";
import Storage from "./storage.js";

// Default model when there is nothing in local storage.
const defaultModel = {
  quotes: [
    {
      quote:
        "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
    },
  ],
  currentBGColor: config.optionalBGColors[0],
};

export default class Model {
  constructor() {
    // TODO: Clone this object.
    this.model = defaultModel;
    this.storage = new Storage();
  }

  getRandomQuote() {
    const { quotes } = this.model;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return {
      quote: randomQuote.quote,
      author: randomQuote.author,
    };
  }

  getCurrentBGColor() {
    return this.model.currentBGColor;
  }

  async setCurrentBGColor(bgColor) {
    this.model.currentBGColor = bgColor;
    await this.storage.save("quotesModel", this.model);
  }

  async load() {
    const storedData = await this.storage.load("quotesModel");

    if (storedData) {
      this.model = storedData;
    }
  }

  async save() {
    await this.storage.save("quotesModel", this.model);
  }

  async clear() {
    await this.storage.clear();
    this.model = defaultModel;
  }

  addQuote(quote, author) {
    this.model.quotes.push({
      quote,
      author,
    });
  }

  uploadFile() {
    // Create a new file input element.
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".tsv";

    // Add an event listener for when a file is selected.
    input.addEventListener("change", () => {
      const reader = new FileReader();

      // Setup the callback for when reading is complete.
      reader.onload = async (e) => {
        // The result attribute contains the contents of the file.
        const contents = e.target.result;
        const rows = contents.split("\n");
        const currentQuotes = rows
          .map((row) => row.split("\t"))
          .filter((cols) => cols[0] && cols[0].length > 0)
          .map((cols) => ({
            quote: cols[0],
            author: cols[1],
          }));

        this.model.quotes = currentQuotes;
      };

      // Start reading the file as text.
      reader.readAsText(this.files[0]);
    });

    // Programmatically trigger a click to open the file dialog
    input.click();
  }

  downloadFile() {
    const currentQuotes = this.model.quotes;

    // Convert the data to CSV format.
    const csvContent = currentQuotes
      .map((quote) => `${quote.quote}\t${quote.author}`)
      .join("\n");

    // Create a Blob with the CSV data.
    const blob = new Blob([csvContent], { type: "text/tsv;charset=utf-8;" });

    // Create a URL for the Blob.
    const url = URL.createObjectURL(blob);

    // Create a link and click it to start the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.tsv";
    link.click();
  }
}
