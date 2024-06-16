document.getElementById("materialForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var materialName = document.getElementById("materialName").value;
        var materialThickness = document.getElementById("materialThickness").value;
        var materialTableBody = document.getElementById("materialTableBody");
        var newRow = document.createElement("tr");
        var nameCell = document.createElement("td");
        var thicknessCell = document.createElement("td");
        var actionsCell = document.createElement("td");
        nameCell.textContent = materialName;
        thicknessCell.textContent = materialThickness;
        actionsCell.innerHTML = '<button class="edit-button">Editar</button> <button class="delete-button">Eliminar</button>';
        newRow.appendChild(nameCell);
        newRow.appendChild(thicknessCell);
        newRow.appendChild(actionsCell);
        materialTableBody.appendChild(newRow);
        document.getElementById("materialName").value = "";
        document.getElementById("materialThickness").value = "";
    
        // Add event listeners to edit and delete buttons
        var editButtons = document.querySelectorAll(".edit-button");
        var deleteButtons = document.querySelectorAll(".delete-button");
    
        editButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                var row = this.parentNode.parentNode;
                var name = row.querySelector("td:nth-child(1)").textContent;
                var thickness = row.querySelector("td:nth-child(2)").textContent;
                // Perform edit action here
                console.log("Editing material:", name, thickness);
            });
        });
    
        deleteButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                var row = this.parentNode.parentNode;
                row.parentNode.removeChild(row);
                // Perform delete action here
                console.log("Deleting material");
            });
        });
    });