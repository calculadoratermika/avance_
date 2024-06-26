$(document).ready(function() {
    // Datos de ejemplo (simulando los datos de tu base de datos)
    var materiales = [
        { categoria: "Categoría A", nombre: "Material 1" },
        { categoria: "Categoría A", nombre: "Material 2" },
        { categoria: "Categoría B", nombre: "Material 3" },
        { categoria: "Categoría B", nombre: "Material 4" },
        { categoria: "Categoría C", nombre: "Material 5" }
    ];

    // Función para llenar el primer select con las categorías únicas
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

    // Llenar el primer select al cargar la página
    llenarCategorias();

    // Evento para cambiar las opciones del segundo select cuando se elige una categoría
    $('#categoria-select').change(function() {
        var categoriaSeleccionada = $(this).val();
        $('#material-select').empty().append('<option value="">Selecciona un material</option>').prop('disabled', false);
        $.each(materiales, function(index, material) {
            if (material.categoria === categoriaSeleccionada) {
                $('#material-select').append($('<option>', {
                    value: material.nombre,
                    text: material.nombre
                }));
            }
        });
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
        const actionsCell = row.insertCell(3);

        orderCell.textContent = dataTable.rows.length;
        materialCell.textContent = material;
        espesorCell.textContent = espesor;
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
                espesor: cells[2].textContent
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
