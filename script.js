document
  .getElementById("createTableBtn")
  .addEventListener("click", function () {
    document.getElementById("tableForm").classList.remove("hidden");
    document.getElementById("createTableBtn").classList.add("hidden");
  });

document.getElementById("columnCount").addEventListener("input", function () {
  const columnCount = parseInt(this.value);
  const columnTitlesDiv = document.getElementById("columnTitles");

  columnTitlesDiv.innerHTML = ""; // Clear previous inputs

  if (columnCount > 0) {
    for (let i = 1; i <= columnCount; i++) {
      const inputGroup = document.createElement("div");
      inputGroup.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = `Column ${i} Title:`;

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Enter title for column ${i}`;
      input.classList.add("columnTitle");

      inputGroup.appendChild(label);
      inputGroup.appendChild(input);
      columnTitlesDiv.appendChild(inputGroup);
    }
    columnTitlesDiv.classList.remove("hidden");
  } else {
    columnTitlesDiv.classList.add("hidden");
  }
});

document.getElementById("tableForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const tableName = document.getElementById("tableName").value;
  const columnTitles = Array.from(
    document.querySelectorAll(".columnTitle")
  ).map((input) => input.value);

  createTable(tableName, columnTitles);
  document.getElementById("tableForm").classList.add("hidden");
});

function createTable(name, columns) {
  const tableContainer = document.getElementById("tableContainer");

  // Create table
  const table = document.createElement("table");

  // Create table caption
  const caption = document.createElement("caption");
  caption.textContent = name;
  table.appendChild(caption);

  // Create table header row
  const headerRow = document.createElement("tr");
  columns.forEach((title) => {
    const th = document.createElement("th");
    th.textContent = title;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add empty input row for user input
  const inputRow = document.createElement("tr");
  columns.forEach(() => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("row-input");
    td.appendChild(input);
    inputRow.appendChild(td);
  });
  table.appendChild(inputRow);

  // Append table to container
  tableContainer.innerHTML = ""; // Clear previous table
  tableContainer.appendChild(table);

  // Create "Add Row" button
  const addRowBtn = document.createElement("button");
  addRowBtn.textContent = "Add Row";
  addRowBtn.classList.add("btn", "add-row-btn");
  addRowBtn.addEventListener("click", () => addRow(table, columns.length));
  tableContainer.appendChild(addRowBtn);

  // Create "Update Table" button
  const updateTableBtn = document.createElement("button");
  updateTableBtn.textContent = "Update Table";
  updateTableBtn.classList.add("btn", "update-table-btn");
  updateTableBtn.addEventListener("click", () => updateTable(table, columns));
  tableContainer.appendChild(updateTableBtn);
}

function addRow(table, columnCount) {
  const newRow = document.createElement("tr");
  for (let i = 0; i < columnCount; i++) {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("row-input");
    td.appendChild(input);
    newRow.appendChild(td);
  }
  table.appendChild(newRow);
}

function updateTable(table, columns) {
  const rows = table.querySelectorAll("tr");
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip header row

    const inputs = row.querySelectorAll("input");
    inputs.forEach((input, colIndex) => {
      const cell = document.createElement("td");
      cell.textContent = input.value;
      row.replaceChild(cell, input.parentElement);
    });
  });
}
