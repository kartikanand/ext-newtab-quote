import config from "./config.js";

// Simplified storage using localStorage directly
const storage = {
  async load(key) {
    const jsonString = localStorage.getItem(key);
    return jsonString ? JSON.parse(jsonString) : null;
  },

  async save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  async clear() {
    localStorage.clear();
  },
};

const defaultModel = {
  quotes: [
    {
      id: 1,
      quote:
        "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
    },
    {
      id: 2,
      quote:
        "The happiness of your life depends upon the quality of your thoughts.",
      author: "Marcus Aurelius",
    },
    {
      id: 3,
      quote:
        "It is not what happens to you, but how you react to it that matters.",
      author: "Epictetus",
    },
    {
      id: 4,
      quote: "We suffer more often in imagination than in reality.",
      author: "Seneca",
    },
    {
      id: 5,
      quote: "No man is free who is not master of himself.",
      author: "Epictetus",
    },
    {
      id: 6,
      quote: "The best revenge is not to be like your enemy.",
      author: "Marcus Aurelius",
    },
    {
      id: 7,
      quote: "Every new beginning comes from some other beginning's end.",
      author: "Seneca",
    },
    {
      id: 8,
      quote:
        "Wealth consists in not having great possessions, but in having few wants.",
      author: "Epictetus",
    },
    {
      id: 9,
      quote:
        "If you want to improve, be content to be thought foolish and stupid with regard to external things.",
      author: "Epictetus",
    },
    {
      id: 10,
      quote: "The obstacle is the way.",
      author: "Marcus Aurelius",
    },
  ],
  currentBGColor: config.optionalBGColors[0],
};

export default class Model {
  constructor() {
    this.model = { ...defaultModel };
    this.config = config;
  }

  getRandomQuote() {
    const { quotes } = this.model;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return { quote: randomQuote.quote, author: randomQuote.author };
  }

  getCurrentBGColor() {
    return this.model.currentBGColor;
  }

  async setCurrentBGColor(bgColor) {
    this.model.currentBGColor = bgColor;
    await storage.save("quotesModel", this.model);
  }

  async load() {
    const storedData = await storage.load("quotesModel");
    if (storedData) {
      this.model = storedData;
    }
  }

  async save() {
    await storage.save("quotesModel", this.model);
  }

  async clear() {
    await storage.clear();
    this.model = { ...defaultModel };
  }

  addQuote(quote, author) {
    const id = Date.now().toString();
    this.model.quotes.push({ id, quote, author });
    this.save();
  }

  editQuote(id, quote, author) {
    const quoteToEdit = this.model.quotes.find((q) => q.id === id);
    if (quoteToEdit) {
      quoteToEdit.quote = quote;
      quoteToEdit.author = author;
      this.save();
    }
  }

  deleteQuote(id) {
    this.model.quotes = this.model.quotes.filter((q) => q.id !== id);
    this.save();
  }

  uploadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".tsv";

    input.addEventListener("change", (ev) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const contents = e.target.result;
        const rows = contents.split("\n");
        const quotes = rows
          .map((row) => row.split("\t"))
          .filter((cols) => cols[0] && cols[0].length > 0)
          .map((cols) => ({
            id: cols[0],
            quote: cols[1],
            author: cols[2],
          }));

        this.model.quotes = quotes;
        await this.save();
      };
      reader.readAsText(ev.target.files[0]);
    });

    input.click();
  }

  downloadFile() {
    const csvContent = this.model.quotes
      .map((quote) => `${quote.id}\t${quote.quote}\t${quote.author}`)
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/tsv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.tsv";
    link.click();
  }
}
