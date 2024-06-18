document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('material-select');
    const tablaDatos = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const formTabla = document.getElementById('formTabla');

    // Cargar materiales al cargar la página
    cargarMateriales();

    // Cargar elementos de localStorage al cargar la página
    cargarElementosGuardados();

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

    // Función para cargar elementos guardados en localStorage
    function cargarElementosGuardados() {
        const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
        elementos.forEach(elemento => {
            agregarFila(elemento.material, elemento.espesor);
        });
    }

    // Función para agregar fila a la tabla y guardar en localStorage
    function agregarFila(material, espesor) {
        const newRow = tablaDatos.insertRow();
        newRow.setAttribute('draggable', true);
        newRow.innerHTML = `
            <td>${material}</td>
            <td>${espesor}</td>
            <td><button class="btnEliminar" title="Eliminar"><i class="fas fa-trash"></i></button></td>
        `;

        // Guardar en localStorage
        guardarEnLocalStorage(material, espesor);

        // Agregar eventos de arrastrar y soltar
        newRow.addEventListener('dragstart', dragStart);
        newRow.addEventListener('dragover', dragOver);
        newRow.addEventListener('drop', drop);
        newRow.addEventListener('dragend', dragEnd);
    }

    // Función para guardar elemento en localStorage
    function guardarEnLocalStorage(material, espesor) {
        const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
        elementos.push({ material, espesor });
        localStorage.setItem('tablaElementos', JSON.stringify(elementos));
    }

    // Evento de submit del formulario
    formTabla.addEventListener('submit', function(event) {
        event.preventDefault();
        const espesor = document.getElementById('espesor').value.trim();
        const selectedMaterial = materialSelect.value;

        if (selectedMaterial && espesor !== '') {
            agregarFila(selectedMaterial, espesor);
            document.getElementById('espesor').value = ''; // Limpiar el campo de espesor
            materialSelect.value = ''; // Reiniciar la selección del material
        } else {
            alert('Selecciona un material y proporciona un espesor válido.');
        }
    });

    // Evento click en el botón de eliminar
    tablaDatos.addEventListener('click', function(event) {
        if (event.target.closest('.btnEliminar')) {
            const row = event.target.closest('tr');
            row.remove();
            actualizarLocalStorage(); // Actualizar localStorage al eliminar fila
        }
    });

    // Función para actualizar localStorage después de eliminar fila
    function actualizarLocalStorage() {
        const filas = tablaDatos.querySelectorAll('tr');
        const elementos = [];
        filas.forEach(fila => {
            const material = fila.cells[0].textContent;
            const espesor = fila.cells[1].textContent;
            elementos.push({ material, espesor });
        });
        localStorage.setItem('tablaElementos', JSON.stringify(elementos));
    }

    // Botón para vaciar la tabla
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');
    btnVaciarTabla.addEventListener('click', function() {
        if (confirm('¿Seguro que quieres vaciar la tabla?')) {
            tablaDatos.innerHTML = ''; // Vaciar la tabla
            localStorage.removeItem('tablaElementos'); // Limpiar localStorage
        }
    });

    // Funciones de arrastrar y soltar
    let draggingElement;

    function dragStart(event) {
        draggingElement = event.target;
        event.target.classList.add('dragging');
    }

    function dragOver(event) {
        event.preventDefault();
        const afterElement = getDragAfterElement(tablaDatos, event.clientY);
        if (afterElement == null) {
            tablaDatos.appendChild(draggingElement);
        } else {
            tablaDatos.insertBefore(draggingElement, afterElement);
        }
    }

    function drop(event) {
        event.preventDefault();
    }

    function dragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('tr[draggable="true"]:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
