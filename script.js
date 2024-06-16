document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialSelect = document.getElementById('materialSelect');
    const densityInput = document.getElementById('densityInput');
    const conductivityInput = document.getElementById('conductivityInput');

    let isFirstEdit = true;

    // Función para cargar los valores del archivo CSV en la lista desplegable
    function loadMaterialOptions() {
        fetch('materials.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                rows.forEach(row => {
                    const [material, density, conductivity] = row.split(',');
                    const option = document.createElement('option');
                    option.value = material.trim();
                    option.textContent = material.trim();
                    materialSelect.appendChild(option);
                });
            });
    }

    // Cargar la lista desplegable al editar por primera vez el campo "Nombre del material"
    materialForm.addEventListener('input', function(e) {
        if (e.target.id === 'materialName' && isFirstEdit) {
            loadMaterialOptions();
            isFirstEdit = false;
        }
    });

    materialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedMaterial = materialSelect.value;
        const selectedDensity = densityInput.value;
        const selectedConductivity = conductivityInput.value;
        // Procesar los datos seleccionados
        console.log('Material seleccionado:', selectedMaterial);
        console.log('Densidad seleccionada:', selectedDensity);
        console.log('Conductividad térmica seleccionada:', selectedConductivity);
        // Resto de la lógica para guardar o utilizar los datos
    });
});