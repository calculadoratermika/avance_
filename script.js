document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('material-select');
    const tablaDatos = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const formTabla = document.getElementById('formTabla');
    const btnVaciarTabla = document.getElementById('btnVaciarTabla');

    let elementosCargados = false;

    cargarMateriales();
    cargarElementosGuardados();

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

    function cargarElementosGuardados() {
        if (!elementosCargados) {
            const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
            elementos.forEach(elemento => {
                agregarFila(elemento.material, elemento.espesor);
            });
            elementosCargados = true;
        }
    }

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

    formTabla.addEventListener('submit', function(event) {
        event.preventDefault();
        const espesor = document.getElementById('espesor').value.trim();
        const selectedMaterial = materialSelect.value;

        if (selectedMaterial && espesor !== '') {
            limpiarLocalStorage();
            agregarFila(selectedMaterial, espesor);
            document.getElementById('espesor').value = '';
            materialSelect.value = '';
        } else {
            alert('Selecciona un material y proporciona un espesor válido.');
        }
    });

    tablaDatos.addEventListener('click', function(event) {
        if (event.target.closest('.btnEliminar')) {
            const row = event.target.closest('tr');
            const material = row.cells[0].textContent;
            const espesor = row.cells[1].textContent;
            row.remove();
            actualizarLocalStorage(material, espesor);
        }
    });

    btnVaciarTabla.addEventListener('click', function() {
        if (confirm('¿Seguro que quieres vaciar la tabla?')) {
            tablaDatos.innerHTML = '';
            localStorage.removeItem('tablaElementos');
        }
    });

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

    function guardarEnLocalStorage(material, espesor) {
        const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
        elementos.push({ material, espesor });
        localStorage.setItem('tablaElementos', JSON.stringify(elementos));
    }

    function limpiarLocalStorage() {
        localStorage.removeItem('tablaElementos');
    }

    function actualizarLocalStorage(material, espesor) {
        const elementos = JSON.parse(localStorage.getItem('tablaElementos')) || [];
        const index = elementos.findIndex(e => e.material === material && e.espesor === espesor);
        if (index !== -1) {
            elementos.splice(index, 1);
            localStorage.setItem('tablaElementos', JSON.stringify(elementos));
        }
    }
});
