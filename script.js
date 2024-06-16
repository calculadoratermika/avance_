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
        thicknessInput.addEventListener('input', () => showOkButton(row));
        thicknessCell.appendChild(thicknessInput);

        const actionsCell = row.insertCell(2);

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.classList.add('ok');
        okButton.style.display = 'none';
        okButton.addEventListener('click', () => updateThickness(row, thicknessInput.value));
        actionsCell.appendChild(okButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteMaterial(row));
        actionsCell.appendChild(deleteButton);
    }

    function renderMaterials(materials) {
        materials.forEach(material => addMaterial(material.name, material.thickness));
    }

    function showOkButton(row) {
        const okButton = row.cells[2].querySelector('.ok');
        okButton.style.display = 'inline-block';
    }

    function updateThickness(row, newThickness) {
        const name = row.cells[0].textContent;
        materials = materials.map(material => 
            material.name === name ? { name, thickness: newThickness } : material);
        localStorage.setItem('materials', JSON.stringify(materials));
        const okButton = row.cells[2].querySelector('.ok');
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
