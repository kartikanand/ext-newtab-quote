export default class View {
  constructor(controller) {
    this.controller = controller;

    this.newQuote = false;

    this.tableBody = document.querySelector(".quotes-table tbody");
    this.table = document.querySelector(".quotes-table");
    this.newQuoteButton = document.querySelector("#new-quote-button");
    this.addQuoteButton = document.querySelector("#add-quote-button");
    this.addQuoteContainer = document.querySelector(".add-quote-container");
    this.newQuoteButton = document.querySelector("#new-quote-button");
    this.fileDownloadButton = document.querySelector("#file-download-button");
    this.fileUploadButton = document.querySelector("#file-upload-button");

    // Add all event listeners.
    this.addEventListeners();
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

  // eslint-disable-next-line class-methods-use-this
  handleEditRow(row) {
    const quoteCol = row.querySelector("[data-id='quote']");
    const authorCol = row.querySelector("[data-id='author']");
    const editBtn = row.querySelector("[data-id='edit']");

    const quote = quoteCol.textContent;
    const author = authorCol.textContent;

    quoteCol.textContent = "";
    authorCol.textContent = "";

    quoteCol.innerHTML = `
      <input type="text" value="${quote}" />
    `;
    authorCol.innerHTML = `
      <input type="text" value="${author}" />
    `;

    editBtn.dataset.id = "save";
    editBtn.textContent = "save";
  }

  handleDeleteRow(row) {
    const { id } = row.dataset;
    this.controller.model.deleteQuote(id);
    row.remove();
    this.showToast("Quote deleted successfully");
  }

  // eslint-disable-next-line class-methods-use-this
  handleSaveRow(row) {
    const quoteCol = row.querySelector("[data-id='quote']");
    const authorCol = row.querySelector("[data-id='author']");
    const saveBtn = row.querySelector("[data-id='save']");

    const quote = quoteCol.querySelector("input").value;
    const author = authorCol.querySelector("input").value;

    quoteCol.innerHTML = "";
    authorCol.innerHTML = "";

    quoteCol.textContent = quote;
    authorCol.textContent = author;

    saveBtn.dataset.id = "edit";
    saveBtn.textContent = "edit";

    const { id } = row.dataset;
    this.controller.model.editQuote(id, quote, author);
  }

  addEventListeners() {
    this.tableBody.addEventListener("click", (ev) => {
      const { target } = ev;

      if (target.nodeName !== "BUTTON") {
        return;
      }

      const row = target.closest("tr");
      if (target.dataset.id === "delete") {
        this.handleDeleteRow(row);
      } else if (target.dataset.id === "edit") {
        this.handleEditRow(row);
      } else if (target.dataset.id === "save") {
        this.handleSaveRow(row);
      }
    });

    this.newQuoteButton.addEventListener("click", (ev) => {
      ev.preventDefault();

      this.newQuote = !this.newQuote;
      this.render();
    });

    this.addQuoteButton.addEventListener("click", async (ev) => {
      ev.preventDefault();

      this.newQuote = false;
      await this.addQuote();
      this.render();
    });

    this.fileDownloadButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.controller.handleFileDownload();
    });

    this.fileUploadButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      this.controller.handleFileUpload();
    });
  }

  addQuoteToTable(quote) {
    const { tableBody } = this;

    console.log("coming here");

    // Create a new table row
    const newRow = document.createElement("tr");

    // Create the Quote cell
    const quoteCell = document.createElement("td");
    quoteCell.textContent = quote.quote;
    quoteCell.dataset.id = "quote";

    // Create the Author cell
    const authorCell = document.createElement("td");
    authorCell.textContent = quote.author;
    authorCell.dataset.id = "author";

    // Create the Actions cell
    const actionsCell = document.createElement("td");

    // Create Edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.dataset.id = "edit";

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = "delete";

    // Append buttons to the Actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Append all cells to the row
    newRow.appendChild(quoteCell);
    newRow.appendChild(authorCell);
    newRow.appendChild(actionsCell);

    newRow.dataset.id = quote.id;

    // Append the row to the table body
    tableBody.appendChild(newRow);
  }

  render() {
    const quoteContainerClass = !this.newQuote ? "active" : "disabled";
    const addQuoteFormContainerClass = this.newQuote ? "active" : "disabled";

    this.table.classList.remove("active");
    this.table.classList.remove("disabled");
    this.table.classList.add(quoteContainerClass);

    this.addQuoteContainer.classList.remove("active");
    this.addQuoteContainer.classList.remove("disabled");
    this.addQuoteContainer.classList.add(addQuoteFormContainerClass);

    const { quotes } = this.controller.model.model;

    console.log(quotes);

    quotes.forEach((quote) => this.addQuoteToTable(quote));
  }

  // eslint-disable-next-line class-methods-use-this
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
