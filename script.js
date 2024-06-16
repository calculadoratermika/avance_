document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar elementos del DOM
    const materialForm = document.getElementById('materialForm');
    const materialNameInput = document.getElementById('materialName');
    const materialThicknessInput = document.getElementById('materialThickness');
    const materialTableBody = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    const materialList = document.getElementById('materialList');

    // Función para cargar las opciones de material desde el archivo CSV
    function loadMaterialOptions() {
        fetch('materials.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                materialList.innerHTML = ''; // Limpiar la lista antes de rellenarla
                rows.forEach(row => {
                    const [material] = row.split(',');
                    const option = document.createElement('option');
                    option.value = material;
                    option.textContent = material;
                    materialList.appendChild(option);
                });
            });
    }

    // Función para agregar un nuevo material a la tabla
    function addMaterial() {
        const materialName = materialNameInput.value;
        const materialThickness = parseFloat(materialThicknessInput.value);

        if (materialName && !isNaN(materialThickness)) {
            const row = materialTableBody.insertRow();
            const nameCell = row.insertCell(0);
            const thicknessCell = row.insertCell(1);
            const deleteCell = row.insertCell(2);

            nameCell.textContent = materialName;
            thicknessCell.textContent = materialThickness.toFixed(2);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                materialTableBody.removeChild(row);
            });

            deleteCell.appendChild(deleteButton);

            materialNameInput.value = '';
            materialThicknessInput.value = '';
        } else {
            alert('Por favor, ingrese un nombre de material válido y un espesor numérico.');
        }
    }

    // Función para editar un material existente en la tabla
    function editMaterial(rowIndex) {
        const nameCell = materialTableBody.rows[rowIndex].cells[0];
        const thicknessCell = materialTableBody.rows[rowIndex].cells[1];

        const materialName = prompt('Ingrese el nuevo nombre del material:', nameCell.textContent);
        const materialThickness = parseFloat(prompt('Ingrese el nuevo espesor del material:', thicknessCell.textContent));

        if (materialName && !isNaN(materialThickness)) {
            nameCell.textContent = materialName;
            thicknessCell.textContent = materialThickness.toFixed(2);
        } else {
            alert('Por favor, ingrese un nombre de material válido y un espesor numérico.');
        }
    }

    // Función para eliminar un material de la tabla
    function deleteMaterial(rowIndex) {
        materialTableBody.deleteRow(rowIndex);
    }

    // Función para llenar la tabla de elementos con los elementos del archivo CSV
    function fillTableFromCSV() {
        fetch('materials.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                rows.forEach(row => {
                    const [material, thickness] = row.split(',');
                    const row = materialTableBody.insertRow();
                    const nameCell = row.insertCell(0);
                    const thicknessCell = row.insertCell(1);

                    nameCell.textContent = material;
                    thicknessCell.textContent = parseFloat(thickness).toFixed(2);
                });
            });
    }

    // Agregar evento de envío al formulario
    materialForm.addEventListener('submit', event => {
        event.preventDefault();
        addMaterial();
    });

    // Agregar evento de cambio al campo de nombre de material
    materialNameInput.addEventListener('input', loadMaterialOptions);

    // Agregar eventos de clic a los botones de edición y eliminación
    materialTableBody.addEventListener('click', event => {
        if (event.target.textContent === 'Editar') {
            const rowIndex = Array.prototype.indexOf.call(event.target.parentElement.parentElement.children, event.target.parentElement);
            editMaterial(rowIndex);
        } else if (event.target.textContent === 'Eliminar') {
            const rowIndex = Array.prototype.indexOf.call(event.target.parentElement.parentElement.children, event.target.parentElement);
            deleteMaterial(rowIndex);
        }
    });

    // Cargar las opciones de material y llenar la tabla inicialmente
    loadMaterialOptions();
    fillTableFromCSV();
});