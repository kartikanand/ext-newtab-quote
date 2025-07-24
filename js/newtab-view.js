export default class View {
  constructor(controller) {
    this.controller = controller;
    this.newQuote = false;

    // Get all DOM elements
    this.quoteContainer = document.querySelector(".quote-container");
    this.quoteTitle = document.querySelector("#quote-title");
    this.quoteAuthor = document.querySelector("#quote-author");
    this.addQuoteContainer = document.querySelector(".add-quote-container");
    this.newQuoteButton = document.querySelector("#new-quote-button");
    this.newQuoteButtonImg = this.newQuoteButton.querySelector("img");
    this.randomQuoteButton = document.querySelector("#random-quote-button");
    this.settingsButton = document.querySelector("#settings-button");
    this.colorButton = document.querySelector("#color-button");
    this.menuButton = document.querySelector("#menu-btn");
    this.menuContainer = document.querySelector("#menu-container");

    // Get all menu buttons except the main menu button
    this.menuButtons = Array.from(
      this.menuContainer.querySelectorAll(".round-btn:not(#menu-btn)")
    );

    // Get color submenu elements
    this.subMenu = this.menuContainer.querySelector(".sub-menu");
    this.subButtons = Array.from(this.subMenu.querySelectorAll(".round-btn"));

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    // Menu button
    this.menuButton.addEventListener("click", () => {
      this.toggleMenu();
    });

    // New quote button
    this.newQuoteButton.addEventListener("click", () => {
      this.newQuote = !this.newQuote;
      this.render();
    });

    // Random quote button
    this.randomQuoteButton.addEventListener("click", () => {
      this.controller.handleRandomQuote();
    });

    // Settings button
    this.settingsButton.addEventListener("click", () => {
      this.controller.handleSettingsButtonClick();
    });

    // Color button
    this.colorButton.addEventListener("click", () => {
      this.toggleColorMenu();
    });

    // Add quote button
    const addQuoteButton = document.querySelector("#add-quote-button");
    if (addQuoteButton) {
      addQuoteButton.addEventListener("click", async () => {
        await this.addQuote();
        this.newQuote = false;
        this.render();
      });
    }
  }

  async addQuote() {
    const quote = document.getElementById("add-quote-title")?.value;
    const author = document.getElementById("add-quote-author")?.value;

    if (!quote || quote.length === 0) {
      alert("Empty quote");
      return;
    }

    await this.controller.handleAddQuote({ quote, author });
  }

  render() {
    const quoteContainerClass = !this.newQuote ? "active" : "disabled";
    const addQuoteFormContainerClass = this.newQuote ? "active" : "disabled";
    const newQuoteButtonContainerClass = !this.newQuote ? "active" : "cancel";

    this.quoteContainer.classList.remove("active", "disabled");
    this.quoteContainer.classList.add(quoteContainerClass);

    this.addQuoteContainer.classList.remove("active", "disabled");
    this.addQuoteContainer.classList.add(addQuoteFormContainerClass);

    // Hide add quote form by default
    if (!this.newQuote) {
      this.addQuoteContainer.style.display = "none";
    } else {
      this.addQuoteContainer.style.display = "block";
    }

    this.newQuoteButton.classList.remove("active", "cancel");
    this.newQuoteButton.classList.add(newQuoteButtonContainerClass);

    this.newQuoteButtonImg.src = this.newQuote
      ? "/assets/cancel.svg"
      : "/assets/add.svg";
  }

  renderQuote({ quote, author }) {
    this.quoteTitle.classList.add("fade");
    this.quoteAuthor.classList.add("fade");

    setTimeout(() => {
      this.quoteTitle.innerText = quote;
      this.quoteAuthor.innerText = author;

      this.quoteTitle.classList.remove("fade");
      this.quoteAuthor.classList.remove("fade");
    }, 500);
  }

  renderColorButtons({ currentBGColor, optionalBGColors }) {
    const colorButtons = document.querySelectorAll(".sub-menu .round-btn");

    colorButtons.forEach((button, index) => {
      const color = optionalBGColors[index];
      button.style.backgroundColor = color;

      // Ensure buttons are hidden initially
      button.classList.add("hidden");
      button.classList.remove("show");

      button.addEventListener("click", async () => {
        document.body.style.backgroundColor = color;
        await this.controller.model.setCurrentBGColor(color);

        // Hide the color menu after selection
        this.toggleColorMenu();
      });
    });

    // Set current background color
    document.body.style.backgroundColor = currentBGColor;
  }

  toggleMenu() {
    // Toggle visibility of all menu buttons except the menu button itself
    this.menuButtons.forEach((button) => {
      button.classList.toggle("hidden");
      button.classList.toggle("show");
    });

    // Close color submenu if it's open
    if (!this.subMenu.classList.contains("hidden")) {
      this.subMenu.classList.add("hidden");
      this.subButtons.forEach((button) => {
        button.classList.add("hidden");
        button.classList.remove("show");
      });
    }

    // Close new quote form if it's open
    if (this.newQuote) {
      this.newQuote = false;
      this.render();
    }
  }

  toggleColorMenu() {
    this.subMenu.classList.toggle("hidden");
    this.subButtons.forEach((button) => {
      button.classList.toggle("hidden");
      button.classList.toggle("show");
    });
  }
}
