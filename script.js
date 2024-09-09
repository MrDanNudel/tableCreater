document.addEventListener("DOMContentLoaded", () => {
  const createTableBtn = document.getElementById("createTableBtn");
  const tableForm = document.getElementById("tableForm");
  const columnTitlesContainer = document.getElementById("columnTitles");
  const tableContainer = document.getElementById("tableContainer");
  const addRowBtn = document.getElementById("addRowBtn");
  const updateTableBtn = document.getElementById("updateTableBtn");
  const downloadTableBtn = document.getElementById("downloadTableBtn");
  let editTableBtn;
  let table, tableBody, columnCount, captionInput, columnTitleInputs;

  // Show the form when the "Create Table" button is clicked
  createTableBtn.addEventListener("click", () => {
    createTableBtn.classList.add("hidden");
    tableForm.classList.remove("hidden");
  });

  // Handle column titles generation based on column count input
  document.getElementById("columnCount").addEventListener("input", () => {
    columnCount = parseInt(document.getElementById("columnCount").value);
    columnTitlesContainer.innerHTML = ""; // Clear previous inputs

    if (columnCount > 0) {
      for (let i = 1; i <= columnCount; i++) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        const label = document.createElement("label");
        label.textContent = `Column ${i} Title:`;
        const input = document.createElement("input");
        input.type = "text";
        input.id = `columnTitle${i}`;
        input.required = true;
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        columnTitlesContainer.appendChild(formGroup);
      }

      // Add scrollbar if columns exceed 5
      if (columnCount > 5) {
        columnTitlesContainer.classList.add("scrollable");
      } else {
        columnTitlesContainer.classList.remove("scrollable");
      }
    }
  });

  // Handle table creation with validation
  document.getElementById("createTable").addEventListener("click", (e) => {
    e.preventDefault();

    const tableName = document.getElementById("tableName").value;
    const columnTitles = [];

    if (!tableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    columnCount = parseInt(document.getElementById("columnCount").value);
    if (isNaN(columnCount) || columnCount <= 0) {
      alert("Please enter a valid number of columns.");
      return;
    }

    for (let i = 1; i <= columnCount; i++) {
      const title = document.getElementById(`columnTitle${i}`).value;
      if (!title.trim()) {
        alert(`Please enter a title for Column ${i}.`);
        return;
      }
      columnTitles.push(title);
    }

    createTableBtn.classList.add("hidden");
    tableForm.classList.add("hidden");

    tableContainer.innerHTML = "";

    table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = tableName;
    table.appendChild(caption);

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columnTitles.forEach((title) => {
      const th = document.createElement("th");
      th.textContent = title;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    tableBody = document.createElement("tbody");
    table.appendChild(tableBody);

    addEmptyRow();

    tableContainer.appendChild(table);

    // Show buttons
    addRowBtn.classList.remove("hidden");
    updateTableBtn.classList.remove("hidden");
    downloadTableBtn.classList.remove("hidden");

    // Create Edit Table button
    createEditTableButton();
  });

  function addEmptyRow() {
    const row = document.createElement("tr");
    for (let i = 0; i < columnCount; i++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("row-input");
      td.appendChild(input);
      row.appendChild(td);
    }
    tableBody.appendChild(row);
  }

  addRowBtn.addEventListener("click", () => {
    addEmptyRow();
  });

  updateTableBtn.addEventListener("click", () => {
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      inputs.forEach((input) => {
        const td = input.parentElement;
        td.textContent = input.value;
      });
    });

    // Update table caption with input value
    if (captionInput) {
      const captionElement = table.querySelector("caption");
      captionElement.textContent = captionInput.value;
    }

    // Update column headers (titles)
    const thInputs = table.querySelectorAll("thead th input");
    thInputs.forEach((input, index) => {
      const th = input.parentElement;
      th.textContent = input.value;
    });

    toggleEditMode(false);
  });

  // Create Edit Table button
  function createEditTableButton() {
    editTableBtn = document.createElement("button");
    editTableBtn.textContent = "Edit Table";
    editTableBtn.classList.add("btn");
    tableContainer.appendChild(editTableBtn);

    editTableBtn.addEventListener("click", () => {
      toggleEditMode(true);
    });
  }

  // Toggle between edit and view modes
  function toggleEditMode(isEditing) {
    const rows = tableBody.querySelectorAll("tr");

    if (isEditing) {
      editTableBtn.classList.add("hidden");

      // Convert caption (title) to input field
      const captionElement = table.querySelector("caption");
      const captionValue = captionElement.textContent;
      captionElement.innerHTML = ""; // Clear the caption text
      captionInput = document.createElement("input");
      captionInput.type = "text";
      captionInput.value = captionValue;
      captionElement.appendChild(captionInput);

      // Convert column headers (th) to input fields
      const headerCells = table.querySelectorAll("thead th");
      headerCells.forEach((th) => {
        const thValue = th.textContent;
        th.innerHTML = ""; // Clear the current text
        const thInput = document.createElement("input");
        thInput.type = "text";
        thInput.classList.add("row-input");
        thInput.value = thValue;
        th.appendChild(thInput);
      });

      // Convert table body cells to input fields
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((td) => {
          const input = document.createElement("input");
          input.type = "text";
          input.classList.add("row-input");
          input.value = td.textContent;
          td.innerHTML = "";
          td.appendChild(input);
        });
      });
    } else {
      editTableBtn.classList.remove("hidden");

      // Restore the caption (title) as plain text
      const captionElement = table.querySelector("caption");
      captionElement.textContent = captionInput.value;

      // Restore column headers (titles) as plain text
      const headerCells = table.querySelectorAll("thead th");
      headerCells.forEach((th) => {
        const input = th.querySelector("input");
        th.textContent = input.value;
      });

      // Restore table body cells as plain text
      rows.forEach((row) => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input) => {
          const td = input.parentElement;
          td.textContent = input.value;
        });
      });
    }
  }

  function downloadTable() {
    let text = "";

    // Get the table title from the <caption>
    const tableTitle = table.querySelector("caption").textContent;
    text += `${tableTitle}\n\n`; // Add title to the file content

    const rows = table.querySelectorAll("tr");

    // Get the headers (th) and rows (td)
    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowText = Array.from(cells)
        .map((cell) => cell.textContent)
        .join("\t");
      text += rowText + "\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downloadTableBtn.addEventListener("click", () => {
    downloadTable();
  });
});
