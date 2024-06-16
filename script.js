document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('material-select');
    const tablaDatos = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const formTabla = document.getElementById('formTabla');

    // Función para cargar los materiales desde el archivo CSV
    function cargarMateriales() {
        fetch('materiales.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                rows.forEach(row => {
                    const material = row.trim();
                    if (material !== '') {
                        const option = document.createElement('option');
                        option.value = material;
                        option.textContent = material;
                        materialSelect.appendChild(option);
                    }
                });
            })
            .catch(error => console.error('Error al cargar el archivo CSV:', error));
    }

    // Cargar materiales al cargar la página
    cargarMateriales();

    // Función para agregar fila a la tabla
    function agregarFila(material, espesor) {
        const newRow = tablaDatos.insertRow();
        newRow.setAttribute('draggable', true);
        newRow.innerHTML = `
            <td>${material}</td>
            <td>${espesor}</td>
            <td><button class="btnEliminar">Eliminar</button></td>
        `;
    }

    // Evento de submit del formulario
    formTabla.addEventListener('submit', function(event) {
        event.preventDefault();
        const espesor = document.getElementById('espesor').value.trim();
        const material = materialSelect.value;

        if (material && espesor !== '') {
            agregarFila(material, espesor);
            document.getElementById('espesor').value = ''; // Limpiar el campo de espesor
        } else {
            alert('Selecciona un material y proporciona un espesor válido.');
        }
    });

    // Evento click en el botón de eliminar
    tablaDatos.addEventListener('click', function(event) {
        if (event.target.classList.contains('btnEliminar')) {
            const row = event.target.closest('tr');
            row.remove();
        }
    });

    // Drag and drop para filas de la tabla
    let draggedRow = null;

    tablaDatos.addEventListener('dragstart', function(event) {
        draggedRow = event.target.closest('tr');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', draggedRow.outerHTML);
        setTimeout(() => {
            draggedRow.classList.add('dragging');
        }, 0);
    });

    tablaDatos.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const targetRow = event.target.closest('tr');
        if (targetRow && targetRow !== draggedRow) {
            const bounding = targetRow.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);

            if (event.clientY - offset > 0) {
                targetRow.after(draggedRow);
            } else {
                targetRow.before(draggedRow);
            }
        }
    });

    tablaDatos.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggedRow) {
            draggedRow.classList.remove('dragging');
            draggedRow = null;
        }
    });

    tablaDatos.addEventListener('dragend', function(event) {
        if (draggedRow) {
            draggedRow.classList.remove('dragging');
            draggedRow = null;
        }
    });
});
