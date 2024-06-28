$(document).ready(function() {
    // Array para almacenar los datos del CSV
    var materiales = [];

    // Función para cargar datos desde el CSV
    function cargarDatosDesdeCSV() {
        fetch('datos.csv')
            .then(response => response.text())
            .then(data => {
                Papa.parse(data, {
                    header: true,
                    complete: function(results) {
                        materiales = results.data;
                        llenarCategorias();
                    }
                });
            });
    }

    // Llenar el primer select con las categorías únicas
    function llenarCategorias() {
        var categorias = [];
        $.each(materiales, function(index, material) {
            if ($.inArray(material.categoria, categorias) === -1) {
                categorias.push(material.categoria);
                $('#categoria-select').append($('<option>', {
                    value: material.categoria,
                    text: material.categoria
                }));
            }
        });
    }

    // Llenar el segundo select con los materiales de la categoría seleccionada
    function llenarMateriales(categoriaSeleccionada) {
        $('#material-select').empty().append('<option value="">Selecciona un material</option>').prop('disabled', false);
        $.each(materiales, function(index, material) {
            if (material.categoria === categoriaSeleccionada) {
                $('#material-select').append($('<option>', {
                    value: material.nombre,
                    text: material.nombre
                }));
            }
        });
    }

    // Llenar categorías al cargar la página
    cargarDatosDesdeCSV();

    // Evento para cambiar las opciones del segundo select cuando se elige una categoría
    $('#categoria-select').change(function() {
        var categoriaSeleccionada = $(this).val();
        llenarMateriales(categoriaSeleccionada);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formTabla');
    const materialSelect = document.getElementById('material-select');
    const espesorInput = document.getElementById('espesor');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');

    // Load data from localStorage
    loadTableData();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addRow(materialSelect.value, espesorInput.value);
        saveTableData();
    });

    btnVaciarTabla.addEventListener('click', () => {
        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }
        saveTableData();
    });

    function addRow(material, espesor) {
        const row = dataTable.insertRow();
        const orderCell = row.insertCell(0);
        const materialCell = row.insertCell(1);
        const espesorCell = row.insertCell(2);
        const conductividadCell = row.insertCell(3);
        const densidadCell = row.insertCell(4);
        const calorEspecificoCell = row.insertCell(5);
        const actionsCell = row.insertCell(6);

        orderCell.textContent = dataTable.rows.length;
        materialCell.textContent = material;

        // Buscar el material en los datos del CSV para obtener las características
        const materialData = materiales.find(m => m.nombre === material);
        if (materialData) {
            espesorCell.textContent = espesor;
            conductividadCell.textContent = materialData.conductividad;
            densidadCell.textContent = materialData.densidad;
            calorEspecificoCell.textContent = materialData.calor_especifico;
        }

        actionsCell.innerHTML = `<button class="btnEliminar"><i class="fas fa-trash"></i></button>`;

        const deleteButton = actionsCell.querySelector('.btnEliminar');
        deleteButton.addEventListener('click', () => {
            row.remove();
            updateOrder();
            saveTableData();
        });

        updateOrder();
    }

    function saveTableData() {
        const tableData = [];
        Array.from(dataTable.rows).forEach(row => {
            const cells = row.cells;
            tableData.push({
                order: cells[0].textContent,
                material: cells[1].textContent,
                espesor: cells[2].textContent,
                conductividad: cells[3].textContent,
                densidad: cells[4].textContent,
                calor_especifico: cells[5].textContent
            });
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
    }

    function loadTableData() {
        const tableData = JSON.parse(localStorage.getItem('tableData') || '[]');
        tableData.forEach(item => {
            addRow(item.material, item.espesor);
        });
    }

    function updateOrder() {
        Array.from(dataTable.rows).forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Make table sortable
    new Sortable(dataTable, {
        animation: 150,
        onEnd: () => {
            updateOrder();
            saveTableData();
        }
    });
});
