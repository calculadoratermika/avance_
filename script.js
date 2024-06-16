// Código JavaScript para manejar la funcionalidad
document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.getElementById('csvFileInput');
    const materialsTable = document.getElementById('materialsTable');
    const addMaterialForm = document.getElementById('addMaterialForm');

    // Función para cargar datos desde CSV
    csvFileInput.addEventListener('change', handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            displayCSVContents(contents);
        };

        reader.readAsText(file);
    }

    function displayCSVContents(contents) {
        // Parse CSV
        const rows = contents.split('\n');
        const headers = rows[0].split(',');

        // Limpiar tabla
        materialsTable.innerHTML = '';

        // Agregar encabezados de tabla
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText.trim();
            headerRow.appendChild(th);
        });
        materialsTable.appendChild(headerRow);

        // Agregar filas de datos
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');
            if (rowData.length === headers.length) {
                const tr = document.createElement('tr');
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData.trim();
                    tr.appendChild(td);
                });
                materialsTable.appendChild(tr);
            }
        }
    }

    // Manejar el envío del formulario para agregar nuevo material
    addMaterialForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const materialInput = document.getElementById('materialInput').value;
        const densityInput = document.getElementById('densityInput').value;
        const conductivityInput = document.getElementById('conductivityInput').value;

        // Crear nueva fila en la tabla
        const newRow = materialsTable.insertRow();
        newRow.innerHTML = `
            <td>${materialInput}</td>
            <td>${densityInput}</td>
            <td>${conductivityInput}</td>
        `;

        // Limpiar los campos del formulario
        addMaterialForm.reset();
    });

    // Habilitar el reordenamiento de filas mediante drag&drop
    const sortableTable = new Sortable(materialsTable, {
        animation: 150, // milisegundos de animación
        ghostClass: 'sortable-ghost' // clase CSS para el elemento fantasma durante el arrastre
    });
});
