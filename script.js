document.addEventListener("DOMContentLoaded", () => {
  const createTableBtn = document.getElementById("createTableBtn");
  const tableForm = document.getElementById("tableForm");
  const columnTitlesContainer = document.getElementById("columnTitles");
  const tableContainer = document.getElementById("tableContainer");
  const addRowBtn = document.getElementById("addRowBtn");
  const updateTableBtn = document.getElementById("updateTableBtn");
  const downloadTableBtn = document.getElementById("downloadTableBtn");
  let table, tableBody, columnCount;

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
      // Add input fields for column titles
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

    // Check for empty table name
    if (!tableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    // Check for column count and validate column titles
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

    // Hide the form and the "Create Table" button
    createTableBtn.classList.add("hidden");
    tableForm.classList.add("hidden");

    // Clear previous table if exists
    tableContainer.innerHTML = "";

    // Create new table with caption
    table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = tableName;
    table.appendChild(caption);

    // Add table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columnTitles.forEach((title) => {
      const th = document.createElement("th");
      th.textContent = title;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add empty body for rows
    tableBody = document.createElement("tbody");
    table.appendChild(tableBody);

    // Add the first empty row with inputs
    addEmptyRow();

    tableContainer.appendChild(table);

    // Show Add Row, Update Table, and Download Table buttons
    addRowBtn.classList.remove("hidden");
    updateTableBtn.classList.remove("hidden");
    downloadTableBtn.classList.remove("hidden");
  });

  // Function to add an empty row with input fields
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

  // Handle Add Row button click
  addRowBtn.addEventListener("click", () => {
    addEmptyRow();
  });

  // Handle Update Table button click
  updateTableBtn.addEventListener("click", () => {
    const rows = tableBody.querySelectorAll("tr");
    let hasValidValues = false;

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      let rowHasValue = false;

      inputs.forEach((input) => {
        if (input.value.trim() !== "") {
          rowHasValue = true;
        }
      });

      if (rowHasValue) {
        hasValidValues = true;
      }
    });

    if (!hasValidValues) {
      alert(
        "Please enter values in at least one row before updating the table."
      );
      return;
    }

    // Update the table with the input values
    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      inputs.forEach((input) => {
        const td = input.parentElement;
        td.textContent = input.value; // Replace input field with entered value
      });
    });
  });

  // Function to download table data as a text file
  function downloadTable() {
    let text = "";
    const rows = table.querySelectorAll("tr");

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

  // Handle Download Table button click
  downloadTableBtn.addEventListener("click", () => {
    downloadTable();
  });
});
