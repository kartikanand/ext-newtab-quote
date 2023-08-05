export default class View {
  constructor({
    handleAddQuote,
    handleRandomQuote,
    handleDeleteAll,
    handleFileDownload,
    handleFileUpload,
    handleBGColorChange,
  }) {
    this.newQuote = false;

    // Save elements we care about to state.
    this.quoteContainer = document.querySelector(".quote-container");
    this.addQuoteContainer = document.querySelector(".add-quote-container");
    this.subMenu = document.querySelector(".sub-menu");
    this.subButtons = document.querySelectorAll(".sub-menu .round-btn");
    this.menuButtons = document.querySelectorAll(
      ".button-container > .round-btn:not(#menu-btn)"
    );

    // Save all buttons to state.
    this.menuButton = document.querySelector("#menu-btn");
    this.colorButton = document.querySelector("#color-button");
    this.newQuoteButton = document.querySelector("#new-quote-button");
    this.randomQuoteButton = document.querySelector("#random-quote-button");
    this.deleteAllButton = document.querySelector("#delete-all-button");
    this.fileDownloadButton = document.querySelector("#file-download-button");
    this.fileUploadButton = document.querySelector("#file-upload-button");
    this.addQuoteButton = document.getElementById("add-quote-button");

    // Any misc. views.
    this.newQuoteButtonImg = document.querySelector("#new-quote-button > img");
    this.quoteTitle = document.getElementById("quote-title");
    this.quoteAuthor = document.getElementById("quote-author");

    // These events are handled by the controller since they do not manipulate view directly.
    this.handleAddQuote = handleAddQuote;
    this.handleRandomQuote = handleRandomQuote;
    this.handleDeleteAll = handleDeleteAll;
    this.handleFileDownload = handleFileDownload;
    this.handleFileUpload = handleFileUpload;
    this.handleBGColorChange = handleBGColorChange;

    // Add all event listeners.
    this.addEventListeners();
  }

  addEventListeners() {
    this.menuButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.toggleMenu();
    });

    this.colorButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.toggleColorMenu();
    });

    this.newQuoteButton.addEventListener("click", (ev) => {
      ev.preventDefault();

      this.newQuote = !this.newQuote;
      this.render();
    });

    this.addQuoteButton.addEventListener("click", async (ev) => {
      ev.preventDefault();

      this.newQuote = false;
      this.addQuote();
      this.render();
    });

    this.randomQuoteButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.handleRandomQuote();
    });

    this.deleteAllButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.handleDeleteAll();
    });

    this.fileDownloadButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.handleFileDownload();
    });

    this.fileUploadButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.handleFileUpload();
    });

    this.subButtons.forEach((button) => {
      button.addEventListener("click", (ev) => {
        const thisButton = ev.target;
        const selectedColor = thisButton.dataset.backgroundColor;

        this.handleBGColorChange(selectedColor);
      });
    });
  }

  addQuote() {
    const quote = document.getElementById("add-quote-title")?.value;
    const author = document.getElementById("add-quote-author")?.value;

    if (!quote || quote.length === 0) {
      alert("Empty quote");
      return;
    }

    this.handleAddQuote({ quote, author });
  }

  render() {
    const quoteContainerClass = !this.newQuote ? "active" : "disabled";
    const addQuoteFormContainerClass = this.newQuote ? "active" : "disabled";
    const newQuoteButtonContainerClass = !this.newQuote ? "active" : "cancel";

    this.quoteContainer.classList.remove("active");
    this.quoteContainer.classList.remove("disabled");
    this.quoteContainer.classList.add(quoteContainerClass);

    this.addQuoteContainer.classList.remove("active");
    this.addQuoteContainer.classList.remove("disabled");
    this.addQuoteContainer.classList.add(addQuoteFormContainerClass);

    this.newQuoteButton.classList.remove("active");
    this.newQuoteButton.classList.remove("cancel");
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
    document.body.style.backgroundColor = currentBGColor;
    this.colorButton.style.backgroundColor = currentBGColor;

    let i = 0;
    this.subButtons.forEach((button) => {
      button.style.backgroundColor = optionalBGColors[i];
      button.dataset.backgroundColor = optionalBGColors[i];

      i += 1;
    });
  }

  toggleMenu() {
    this.menuButtons.forEach((button) => {
      button.classList.toggle("show");
    });

    // Toggle color menu if it's visible while closing the main menu.
    if (
      !this.colorButton.classList.contains("show") &&
      !this.subMenu.classList.contains("hidden")
    ) {
      this.toggleColorMenu();
    }

    // Close new quote flow if it's open
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
