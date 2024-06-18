document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('material-select');
    const tablaDatos = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const formTabla = document.getElementById('formTabla');
    let elementosCargados = false;

    cargarMateriales();
    cargarElementosGuardados();

    // Evento de submit del formulario
    formTabla.addEventListener('submit', function(event) {
        event.preventDefault();
        const espesor = document.getElementById('espesor').value.trim();
        const selectedMaterial = materialSelect.value;

        if (selectedMaterial && espesor !== '') {
            agregarFila(selectedMaterial, espesor);
            document.getElementById('espesor').value = '';
            materialSelect.value = '';
        } else {
            alert('Selecciona un material y proporciona un espesor válido.');
        }
    });

    // Evento click en el botón de eliminar
    tablaDatos.addEventListener('click', function(event) {
        if (event.target.closest('.btnEliminar')) {
            const row = event.target.closest('tr');
            const material = row.cells[0].textContent;
            const espesor = row.cells[1].textContent;
            row.remove();
            actualizarLocalStorage();
        }
    });

    // Evento click en el botón para vaciar la tabla
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');
    if (btnVaciarTabla) {
        btnVaciarTabla.addEventListener('click', function() {
            if (confirm('¿Seguro que quieres vaciar la tabla?')) {
                tablaDatos.innerHTML = '';
                limpiarLocalStorage();
            }
        });
    } else {
        console.error('El botón "btnVaciarTabla" no fue encontrado.');
    }

    // Función para cargar materiales desde el archivo CSV
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
                cargarElementosGuardados();
            })
            .catch(error => console.error('Error al cargar el archivo CSV:', error));
    }

    // Función para cargar elementos guardados en localStorage
    function cargarElementosGuardados() {
        if (!elementosCargados) {
            const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
            elementos.forEach(elemento => {
                agregarFila(elemento.material, elemento.espesor);
            });
            elementosCargados = true;
        }
    }

    // Función para agregar una nueva fila a la tabla
    function agregarFila(material, espesor) {
        const newRow = tablaDatos.insertRow();
        newRow.setAttribute('draggable', true);
        newRow.innerHTML = `
            <td>${material}</td>
            <td>${espesor}</td>
            <td><button class="btnEliminar" title="Eliminar"><i class="fas fa-trash"></i></button></td>
        `;

        guardarEnLocalStorage(material, espesor);

        newRow.addEventListener('dragstart', dragStart);
        newRow.addEventListener('dragover', dragOver);
        newRow.addEventListener('drop', drop);
        newRow.addEventListener('dragend', dragEnd);
    }

    // Función para guardar elementos en localStorage
    function guardarEnLocalStorage(material, espesor) {
        const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
        elementos.push({ material, espesor });
        localStorage.setItem('tablaElementos', JSON.stringify(elementos));
    }

    // Función para limpiar localStorage
    function limpiarLocalStorage() {
        localStorage.removeItem('tablaElementos');
    }

    // Función para actualizar localStorage después de eliminar una fila
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
        const afterElement = getDragAfterElement(tablaDatos, event.clientY);
        if (afterElement == null) {
            tablaDatos.appendChild(draggingElement);
        } else {
            tablaDatos.insertBefore(draggingElement, afterElement);
        }
        actualizarLocalStorage();
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
