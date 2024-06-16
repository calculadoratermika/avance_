document.addEventListener('DOMContentLoaded', () => {
    const materialForm = document.getElementById('materialForm');
    const materialSelect = document.getElementById('materialSelect');
    const densityInput = document.getElementById('densityInput');
    const conductivityInput = document.getElementById('conductivityInput');

    // Leer el archivo CSV y llenar la lista desplegable
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