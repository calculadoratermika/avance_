document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialName = document.getElementById('materialName');
    const materialThickness = document.getElementById('materialThickness');
    const materialTable = document.getElementById('materialTable').getElementsByTagName('tbody')[0];

    // Load materials from localStorage
    let materials = JSON.parse(localStorage.getItem('materials')) || [];
    renderMaterials(materials);

    materialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = materialName.value;
        const thickness = materialThickness.value;
        materials.push({ name, thickness });
        localStorage.setItem('materials', JSON.stringify(materials));
        addMaterial(name, thickness);
        materialName.value = '';
        materialThickness.value = '';
    });

    function addMaterial(name, thickness) {
        const row = materialTable.insertRow();
        row.insertCell(0).textContent = name;

        const thicknessCell = row.insertCell(1);
        const thicknessInput = document.createElement('input');
        thicknessInput.type = 'number';
        thicknessInput.value = thickness;
        thicknessInput.addEventListener('change', () => updateThickness(row, thicknessInput.value));
        thicknessCell.appendChild(thicknessInput);
        
        const actionsCell = row.insertCell(2);
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editMaterial(row));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteMaterial(row));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    }

    function renderMaterials(materials) {
        materials.forEach(material => addMaterial(material.name, material.thickness));
    }

    function editMaterial(row) {
        const name = row.cells[0].textContent;
        const thickness = row.cells[1].querySelector('input').value;
        materialName.value = name;
        materialThickness.value = thickness;
        materialForm.removeEventListener('submit', handleSubmit);
        materialForm.addEventListener('submit', function update(e) {
            e.preventDefault();
            row.cells[0].textContent = materialName.value;
            row.cells[1].querySelector('input').value = materialThickness.value;
            materials = materials.map(material => 
                material.name === name && material.thickness == thickness ? 
                { name: materialName.value, thickness: materialThickness.value } : material);
            localStorage.setItem('materials', JSON.stringify(materials));
            materialName.value = '';
            materialThickness.value = '';
            materialForm.removeEventListener('submit', update);
            materialForm.addEventListener('submit', handleSubmit);
        });
    }

    function updateThickness(row, newThickness) {
        const name = row.cells[0].textContent;
        materials = materials.map(material => 
            material.name === name ? { name, thickness: newThickness } : material);
        localStorage.setItem('materials', JSON.stringify(materials));
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
        materials.push({ name, thickness });
        localStorage.setItem('materials', JSON.stringify(materials));
        addMaterial(name, thickness);
        materialName.value = '';
        materialThickness.value = '';
    }

    materialForm.addEventListener('submit', handleSubmit);
});
