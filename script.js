document.addEventListener("DOMContentLoaded", () => {
  const createTableBtn = document.getElementById("createTableBtn");
  const tableForm = document.getElementById("tableForm");
  const columnTitlesContainer = document.getElementById("columnTitles");
  const tableContainer = document.getElementById("tableContainer");
  const addRowBtn = document.getElementById("addRowBtn");
  const updateTableBtn = document.getElementById("updateTableBtn");
  const downloadTableBtn = document.getElementById("downloadTableBtn");
  const editTableBtn = document.createElement("button");
  let table, tableBody, columnCount;

  // Initialize Edit Table button
  editTableBtn.id = "editTableBtn";
  editTableBtn.className = "btn edit-table-btn hidden";
  editTableBtn.textContent = "Edit Table";

  // Show the form when the "Create Table" button is clicked
  createTableBtn.addEventListener("click", () => {
    createTableBtn.classList.add("hidden");
    tableForm.classList.remove("hidden");
  });

  // Handle column titles generation with fade-in effect based on column count input
  document.getElementById("columnCount").addEventListener("input", () => {
    columnCount = parseInt(document.getElementById("columnCount").value);
    columnTitlesContainer.innerHTML = ""; // Clear previous inputs

    if (columnCount > 0) {
      // Add input fields for column titles with a fade-in effect
      for (let i = 1; i <= columnCount; i++) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group", "fade-in"); // Add fade-in class initially

        const label = document.createElement("label");
        label.textContent = `Column ${i} Title:`;
        const input = document.createElement("input");
        input.type = "text";
        input.id = `columnTitle${i}`;
        input.required = true;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        columnTitlesContainer.appendChild(formGroup);

        // Add a delay before making the element visible
        setTimeout(() => {
          formGroup.classList.add("visible");
        }, i * 300); // Apply 300ms delay for each column
      }

      // Add scrollbar if columns exceed 5
      if (columnCount > 2) {
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

    // Show buttons in the same row with new styles
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(updateTableBtn);
    buttonContainer.appendChild(downloadTableBtn);
    buttonContainer.appendChild(editTableBtn);

    tableContainer.appendChild(buttonContainer);

    // Ensure buttons are not hidden after creating the table
    addRowBtn.classList.remove("hidden");
    updateTableBtn.classList.remove("hidden");
    downloadTableBtn.classList.remove("hidden");
    editTableBtn.classList.remove("hidden");
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

  // Handle Edit Table button click
  editTableBtn.addEventListener("click", () => {
    const isEditing = editTableBtn.textContent === "Edit Table";

    if (isEditing) {
      // Switch to edit mode
      editTableBtn.textContent = "Save Changes";
      table.querySelectorAll("th").forEach((th, index) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = th.textContent;
        th.textContent = "";
        th.appendChild(input);
      });
      table.querySelectorAll("td").forEach((td) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = td.textContent;
        td.textContent = "";
        td.appendChild(input);
      });
    } else {
      // Switch to view mode
      editTableBtn.textContent = "Edit Table";
      table.querySelectorAll("th input").forEach((input, index) => {
        const th = input.parentElement;
        th.textContent = input.value;
      });
      table.querySelectorAll("td input").forEach((input) => {
        const td = input.parentElement;
        td.textContent = input.value;
      });
    }
  });

  // Function to download table data as a text file
  downloadTableBtn.addEventListener("click", () => {
    const rows = table.querySelectorAll("tr");
    let text = table.querySelector("caption").textContent + "\n";

    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowText = Array.from(cells)
        .map((cell) => cell.textContent.trim())
        .join("\t");
      text += rowText + "\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
