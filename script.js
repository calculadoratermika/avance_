document.addEventListener('DOMContentLoaded', () => {
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
                    option.value = material.trim();
                    materialList.appendChild(option);
                });
            });
    }

    // Cargar las opciones al hacer clic en el campo de nombre de material
    materialNameInput.addEventListener('input', loadMaterialOptions);

    // Manejar el envío del formulario
    materialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const materialName = materialNameInput.value;
        const materialThickness = parseInt(materialThicknessInput.value);

        // Crear una nueva fila para la tabla
        const newRow = materialTableBody.insertRow();

        // Crear celdas para la nueva fila
        const nameCell = newRow.insertCell(0);
        const thicknessCell = newRow.insertCell(1);
        const actionsCell = newRow.insertCell(2);

        // Agregar contenido a las celdas
        nameCell.textContent = materialName;
        thicknessCell.textContent = materialThickness;

        // Crear botones de acción
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            // Código para editar el material seleccionado
            // ... (código para editar fila en la tabla)
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            // Código para eliminar el material seleccionado
            // ... (código para eliminar fila de la tabla)
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
});