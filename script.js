document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialNameInput = document.getElementById('materialName');
    const materialList = document.getElementById('materialList');

    // Función para cargar las opciones de material desde el archivo CSV
    function loadMaterialOptions() {
        fetch('materials.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
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
        // Procesar los datos ingresados y agregar a la tabla
        // ... (código para agregar fila a la tabla)
    });
});