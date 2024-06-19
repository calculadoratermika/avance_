document.addEventListener('DOMContentLoaded', function () {
    const materialSelect = document.getElementById('material-select');
    const espesorInput = document.getElementById('espesor');
    const formTabla = document.getElementById('formTabla');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');

    // Load materials from CSV file
    fetch('materiales.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            rows.forEach(row => {
                const option = document.createElement('option');
                option.value = row;
                option.text = row;
                materialSelect.add(option);
            });
        });

    formTabla.addEventListener('submit', function (event) {
        event.preventDefault();

        const material = materialSelect.value;
        const espesor = espesorInput.value;

        if (material && espesor) {
            const row = dataTable.insertRow();

            const cellMaterial = row.insertCell(0);
            const cellEspesor = row.insertCell(1);
            const cellAcciones = row.insertCell(2);

            cellMaterial.textContent = material;
            cellEspesor.textContent = espesor;
            cellAcciones.innerHTML = '<button class="btnEliminar" title="Eliminar"><i class="fas fa-trash-alt"></i></button>';

            espesorInput.value = '';
        }
    });

    dataTable.addEventListener('click', function (event) {
        if (event.target.classList.contains('btnEliminar') || event.target.closest('.btnEliminar')) {
            const row = event.target.closest('tr');
            dataTable.removeChild(row);
        }
    });

    btnVaciarTabla.addEventListener('click', function () {
        dataTable.innerHTML = '';
    });

    // Initialize SortableJS
    new Sortable(dataTable, {
        animation: 150,
        handle: 'tr'
    });
});
