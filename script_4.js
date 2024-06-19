document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('material-select');
    const tablaDatos = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const formTabla = document.getElementById('formTabla');
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');
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
            row.remove();
            actualizarLocalStorage();
        }
    });

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
                // Verificar si el elemento ya existe en la tabla antes de agregarlo
                if (!existeElementoEnTabla(elemento.material, elemento.espesor)) {
                    agregarFila(elemento.material, elemento.espesor);
                }
            });
            elementosCargados = true;
        }
    }

    // Función para verificar si un elemento ya existe en la tabla
    function existeElementoEnTabla(material, espesor) {
        const filas = tablaDatos.querySelectorAll('tr');
        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];
            if (fila.cells[0].textContent === material && fila.cells[1].textContent === espesor) {
                return true;
            }
        }
        return false;
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

    // Evento click en el botón para vaciar la tabla
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

    // Función para limpiar localStorage
    function limpiarLocalStorage() {
        localStorage.removeItem('tablaElementos');
    }
});
