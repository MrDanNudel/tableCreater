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

  // Append table to container
  tableContainer.innerHTML = ""; // Clear previous table
  tableContainer.appendChild(table);
}
