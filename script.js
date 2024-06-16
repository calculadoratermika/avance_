// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    var materialName = document.getElementById("materialName").value;
    var materialThickness = document.getElementById("materialThickness").value;
    var materialTableBody = document.getElementById("materialTableBody");
    var newRow = document.createElement("tr");
    var nameCell = document.createElement('td');
    var thicknessCell = document.createElement('td');
    var actionsCell = document.createElement('td');

    nameCell.textContent = materialName;
    thicknessCell.textContent = materialThickness;
    actionsCell.innerHTML = '<button class="edit-button">Editar</button> <button class="delete-button">Eliminar</button>';
    newRow.appendChild(nameCell);
    newRow.appendChild(thicknessCell);
    newRow.appendChild(actionsCell);
    materialTableBody.appendChild(newRow);

    // Clear input fields after adding the new row
    document.getElementById("materialName").value = "";
    document.getElementById("materialThickness").value = "";

    // Add event listeners to edit and delete buttons for the new row
    var editButtons = newRow.querySelectorAll(".edit-button");
    var deleteButtons = newRow.querySelectorAll(".delete-button");

    const materialTableBody = document.getElementById("materialTableBody");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var row = this.parentNode.parentNode;
            var name = row.querySelector("td:nth-child(1)").textContent;
            var thickness = row.querySelector("td:nth-child(2)").textContent;
            console.log("Editing material:", name, thickness);
            // Add your edit functionality here
        });
    });

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var row = this.parentNode.parentNode;
            row.parentNode.removeChild(row);
            console.log("Deleting material");
            // Add your delete functionality here
        });
    });
}

// Function to handle drag start
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
    event.target.classList.add("dragging");
}

// Function to handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    event.target.classList.add("drag-over");
}

// Function to handle drop
function handleDrop(event) {
    event.preventDefault();
    event.target.classList.remove("drag-over");

    var sourceRow = document.getElementById(event.dataTransfer.getData("text/plain"));
    var targetRow = event.target;

    if (sourceRow !== targetRow) {
        materialTableBody.insertBefore(sourceRow, targetRow.nextSibling);
    }

    sourceRow.classList.remove("dragging");
}

// Add event listeners for drag and drop
const materialTableBody = document.getElementById("materialTableBody");
const rows = materialTableBody.querySelectorAll("tr");

rows.forEach(row => {
  row.addEventListener("dragstart", handleDragStart);
  row.addEventListener("dragover", handleDragOver);
  row.addEventListener("drop", handleDrop);
});

// Add event listener for form submission
document.getElementById("materialForm").addEventListener("submit", handleSubmit);