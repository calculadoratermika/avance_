document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialName = document.getElementById('materialName');
    const materialThickness = document.getElementById('materialThickness');
    const materialTable = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    let materials = JSON.parse(localStorage.getItem('materials')) || [];
    renderMaterials(materials);

    materialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = materialName.value;
        const thickness = materialThickness.value;
        if (name && thickness) {
            materials.push({ name, thickness });
            localStorage.setItem('materials', JSON.stringify(materials));
            addMaterial(name, thickness);
            materialName.value = '';
            materialThickness.value = '';
        }
    });

    function addMaterial(name, thickness) {
        const row = document.createElement('tr');
        row.draggable = true; // Make the row draggable
        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        row.appendChild(nameCell);
        const thicknessCell = document.createElement('td');
        const thicknessInput = document.createElement('input');
        thicknessInput.type = 'number';
        thicknessInput.value = thickness;
        thicknessInput.addEventListener('input', () => showOkButton(thicknessInput));
        thicknessCell.appendChild(thicknessInput);
        const okButton = document.createElement('button');
        okButton.innerHTML = '&#10003;';
        okButton.classList.add('ok-button');
        okButton.addEventListener('click', () => updateThickness(row, thicknessInput, okButton));
        thicknessCell.appendChild(okButton);
        row.appendChild(thicknessCell);
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteMaterial(row));
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        materialTable.appendChild(row);
    }

    function renderMaterials(materials) {
        materials.forEach(material => addMaterial(material.name, material.thickness));
    }

    function showOkButton(thicknessInput) {
        const okButton = thicknessInput.nextSibling;
        okButton.style.display = 'inline-block';
    }

    function updateThickness(row, thicknessInput, okButton) {
        const name = row.cells[0].textContent;
        const newThickness = thicknessInput.value;
        materials = materials.map(material => 
            material.name === name ? { name, thickness: newThickness } : material);
        localStorage.setItem('materials', JSON.stringify(materials));
        okButton.style.display = 'none';
    }

    function deleteMaterial(row) {
        const name = row.cells[0].textContent;
        const thickness = row.cells[1].querySelector('input').value;
        materials = materials.filter(material => 
            !(material.name === name && material.thickness == thickness));
        localStorage.setItem('materials', JSON.stringify(materials));
        row.remove();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = materialName.value;
        const thickness = materialThickness.value;
        if (name && thickness) {
            materials.push({ name, thickness });
            localStorage.setItem('materials', JSON.stringify(materials));
            addMaterial(name, thickness);
            materialName.value = '';
            materialThickness.value = '';
        }
    }

    materialForm.addEventListener('submit', handleSubmit);

    let draggedItem = null;

    document.addEventListener('dragstart', function(event) {
        draggedItem = event.target;
        event.target.style.opacity = '0.5';
    });

    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    document.addEventListener('drop', function(event) {
        if (event.target.tagName === 'TD') {
            event.target.parentNode.before(draggedItem);
            draggedItem.style.opacity = '1';
        }
    });
});