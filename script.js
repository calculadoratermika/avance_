document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialTable = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    let draggedItem = null;

    materialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const materialName = document.getElementById('materialName').value;
        const materialThickness = document.getElementById('materialThickness').value;
        if (materialName && materialThickness) {
            const newRow = createMaterialRow(materialName, materialThickness);
            materialTable.appendChild(newRow);
            updateMaterialsStorage();
            materialForm.reset();
        }
    });

    function createMaterialRow(name, thickness) {
        const row = document.createElement('tr');
        row.draggable = true;
        row.innerHTML = `
            <td>${name}</td>
            <td><input type="number" value="${thickness}" /></td>
            <td><button class="delete">Delete</button></td>
        `;
        return row;
    }

    function updateMaterialsStorage() {
        const rows = materialTable.getElementsByTagName('tr');
        const materials = [];
        for (let i = 0; i < rows.length; i++) {
            const name = rows[i].cells[0].textContent;
            const thickness = rows[i].cells[1].querySelector('input').value;
            materials.push({ name, thickness });
        }
        localStorage.setItem('materials', JSON.stringify(materials));
    }

    materialTable.addEventListener('dragstart', function(event) {
        draggedItem = event.target.closest('tr');
    });

    materialTable.addEventListener('dragover', function(event) {
        event.preventDefault();
        const target = event.target.closest('tr');
        if (draggedItem && target && target !== draggedItem) {
            if (target.nextSibling === draggedItem) {
                materialTable.insertBefore(draggedItem, target);
            } else {
                materialTable.insertBefore(draggedItem, target.nextSibling);
            }
        }
    });

    materialTable.addEventListener('drop', function(event) {
        event.preventDefault();
    });

    materialTable.addEventListener('dragend', function(event) {
        draggedItem = null;
        updateMaterialsStorage();
    });

    materialTable.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            const row = event.target.closest('tr');
            row.remove();
            updateMaterialsStorage();
        }
    });

    // Load materials from localStorage on page load
    const storedMaterials = JSON.parse(localStorage.getItem('materials')) || [];
    storedMaterials.forEach(material => {
        const newRow = createMaterialRow(material.name, material.thickness);
        materialTable.appendChild(newRow);
    });
});