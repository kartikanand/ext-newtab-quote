import { createGradientFromColor, isSettingsPage } from "./shared.js";

export default class View {
  constructor(controller) {
    this.controller = controller;
    this.newQuote = false;
    this.isSettingsPage = isSettingsPage();

    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    if (this.isSettingsPage) {
      this.tableBody = document.querySelector(".quotes-table tbody");
      this.table = document.querySelector(".quotes-table");
      this.fileDownloadButton = document.querySelector("#file-download-button");
      this.fileUploadButton = document.querySelector("#file-upload-button");
    } else {
      this.quoteContainer = document.querySelector(".quote-container");
      this.quoteTitle = document.querySelector("#quote-title");
      this.quoteAuthor = document.querySelector("#quote-author");
      this.menuButton = document.querySelector("#menu-btn");
      this.menuContainer = document.querySelector("#menu-container");
      this.menuButtons = Array.from(
        this.menuContainer.querySelectorAll(".round-btn:not(#menu-btn)")
      );
      this.randomQuoteButton = document.querySelector("#random-quote-button");
      this.settingsButton = document.querySelector("#settings-button");
      this.colorButton = document.querySelector("#color-button");
      this.subMenu = this.menuContainer.querySelector(".sub-menu");
      this.subButtons = Array.from(this.subMenu.querySelectorAll(".round-btn"));
    }

    // Common elements
    this.addQuoteContainer = document.querySelector(".add-quote-container");
    this.newQuoteButton = document.querySelector("#new-quote-button");
    this.addQuoteButton = document.querySelector("#add-quote-button");
  }

  addEventListeners() {
    if (this.isSettingsPage) {
      this.addSettingsEventListeners();
    } else {
      this.addNewTabEventListeners();
    }

    // Common event listeners
    this.newQuoteButton.addEventListener("click", () => {
      this.newQuote = !this.newQuote;
      this.render();
    });

    this.addQuoteButton.addEventListener("click", async () => {
      await this.addQuote();
      this.newQuote = false;
      this.render();
    });
  }

  addNewTabEventListeners() {
    this.menuButton.addEventListener("click", () => this.toggleMenu());
    this.randomQuoteButton.addEventListener("click", () =>
      this.controller.handleRandomQuote()
    );
    this.settingsButton.addEventListener("click", () =>
      this.controller.handleSettingsButtonClick()
    );
    this.colorButton.addEventListener("click", () => this.toggleColorMenu());
  }

  addSettingsEventListeners() {
    this.tableBody.addEventListener("click", (ev) => {
      const { target } = ev;
      if (target.nodeName !== "BUTTON") return;

      const row = target.closest("tr");
      if (target.dataset.id === "delete") {
        this.handleDeleteRow(row);
      } else if (target.dataset.id === "edit") {
        View.handleEditRow(row);
      } else if (target.dataset.id === "save") {
        View.handleSaveRow(row);
      }
    });

    this.fileDownloadButton.addEventListener("click", () =>
      this.controller.handleFileDownload()
    );
    this.fileUploadButton.addEventListener("click", () =>
      this.controller.handleFileUpload()
    );
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
    if (this.isSettingsPage) {
      this.renderSettings();
    } else {
      this.renderNewTab();
    }
  }

  renderNewTab() {
    const quoteContainerClass = !this.newQuote ? "active" : "disabled";
    const addQuoteFormContainerClass = this.newQuote ? "active" : "disabled";

    this.quoteContainer.classList.remove("active", "disabled");
    this.quoteContainer.classList.add(quoteContainerClass);

    this.addQuoteContainer.classList.remove("active", "disabled");
    this.addQuoteContainer.classList.add(addQuoteFormContainerClass);
    this.addQuoteContainer.style.display = this.newQuote ? "block" : "none";

    this.newQuoteButton.classList.remove("active", "cancel");
    this.newQuoteButton.classList.add(!this.newQuote ? "active" : "cancel");

    const img = this.newQuoteButton.querySelector("img");
    if (img) img.src = this.newQuote ? "/assets/cancel.svg" : "/assets/add.svg";
  }

  renderSettings() {
    const quoteContainerClass = !this.newQuote ? "active" : "disabled";
    const addQuoteFormContainerClass = this.newQuote ? "active" : "disabled";

    this.table.classList.remove("active", "disabled");
    this.table.classList.add(quoteContainerClass);

    this.addQuoteContainer.classList.remove("active", "disabled");
    this.addQuoteContainer.classList.add(addQuoteFormContainerClass);

    // Clear and populate table
    this.tableBody.innerHTML = "";
    const { quotes } = this.controller.model.model;
    quotes.forEach((quote) => this.addQuoteToTable(quote));
  }

  renderQuote({ quote, author }) {
    if (!this.quoteTitle || !this.quoteAuthor) return;

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
    if (!this.subButtons) return;

    this.subButtons.forEach((button, index) => {
      if (index >= optionalBGColors.length) return;

      const color = optionalBGColors[index];
      button.style.backgroundColor = color;
      button.classList.add("hidden");
      button.classList.remove("show");

      // Remove existing event listeners
      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);
      this.subButtons[index] = this.subMenu.children[index];

      newButton.addEventListener("click", async () => {
        // Create gradient background based on color
        const gradient = createGradientFromColor(color);
        document.body.style.background = gradient;
        await this.controller.model.setCurrentBGColor(color);
        this.toggleColorMenu();
      });
    });

    // Set current background color
    const currentGradient = createGradientFromColor(currentBGColor);
    document.body.style.background = currentGradient;
  }

  toggleMenu() {
    this.menuButtons.forEach((button) => {
      button.classList.toggle("hidden");
      button.classList.toggle("show");
    });

    if (!this.subMenu.classList.contains("hidden")) {
      this.subMenu.classList.add("hidden");
      this.subButtons.forEach((button) => {
        button.classList.add("hidden");
        button.classList.remove("show");
      });
    }

    if (this.newQuote) {
      this.newQuote = false;
      this.render();
    }
  }

  toggleColorMenu() {
    // Hide tooltip when color menu is opened
    const colorButton = document.querySelector("#color-button");
    const tooltip = colorButton?.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.opacity = "0";
    }

    this.subMenu.classList.toggle("hidden");
    this.subButtons.forEach((button) => {
      button.classList.toggle("hidden");
      button.classList.toggle("show");
    });
  }

  // Settings-specific methods
  addQuoteToTable(quote) {
    const newRow = document.createElement("tr");
    newRow.dataset.id = quote.id;

    const quoteCell = document.createElement("td");
    quoteCell.textContent = quote.quote;
    quoteCell.dataset.id = "quote";

    const authorCell = document.createElement("td");
    authorCell.textContent = quote.author;
    authorCell.dataset.id = "author";

    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.classList.add("outline");
    editButton.innerHTML = '<img src="/assets/edit.svg" alt="Edit" />';
    editButton.dataset.id = "edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("secondary");
    deleteButton.innerHTML = '<img src="/assets/delete.svg" alt="Delete" />';
    deleteButton.dataset.id = "delete";

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    newRow.appendChild(quoteCell);
    newRow.appendChild(authorCell);
    newRow.appendChild(actionsCell);

    this.tableBody.appendChild(newRow);
  }

  static handleEditRow(row) {
    const quoteCol = row.querySelector("[data-id='quote']");
    const authorCol = row.querySelector("[data-id='author']");
    const editBtn = row.querySelector("[data-id='edit']");

    const quote = quoteCol.textContent;
    const author = authorCol.textContent;

    quoteCol.innerHTML = `<input type="text" value="${quote}" />`;
    authorCol.innerHTML = `<input type="text" value="${author}" />`;

    editBtn.dataset.id = "save";
    editBtn.innerHTML = '<img src="/assets/save.svg" alt="Save" />';
  }

  handleDeleteRow(row) {
    const { id } = row.dataset;
    this.controller.model.deleteQuote(id);
    row.remove();
  }

  static handleSaveRow(row) {
    const quoteCol = row.querySelector("[data-id='quote']");
    const authorCol = row.querySelector("[data-id='author']");
    const saveBtn = row.querySelector("[data-id='save']");

    const quote = quoteCol.querySelector("input").value;
    const author = authorCol.querySelector("input").value;

    quoteCol.textContent = quote;
    authorCol.textContent = author;

    saveBtn.dataset.id = "edit";
    saveBtn.innerHTML = '<img src="/assets/edit.svg" alt="Edit" />';

    const { id } = row.dataset;
    this.controller.model.editQuote(id, quote, author);
  }
}
