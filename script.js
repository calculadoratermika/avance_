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
        thicknessInput.addEventListener('input', () => showOkButton(thicknessInput));
        thicknessCell.appendChild(thicknessInput);

        const okButton = document.createElement('button');
        okButton.innerHTML = '&#10003;'; // Check mark symbol
        okButton.classList.add('ok-button');
        okButton.addEventListener('click', () => updateThickness(row, thicknessInput, okButton));
        thicknessCell.appendChild(okButton);

        const actionsCell = row.insertCell(2);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteMaterial(row));
        actionsCell.appendChild(deleteButton);
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
        materials.push({ name, thickness });
        localStorage.setItem('materials', JSON.stringify(materials));
        addMaterial(name, thickness);
        materialName.value = '';
        materialThickness.value = '';
    }

    materialForm.addEventListener('submit', handleSubmit);
});
