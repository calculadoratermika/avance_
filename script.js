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
            row.setAttribute('draggable', true);

            const cellMaterial = row.insertCell(0);
            const cellEspesor = row.insertCell(1);
            const cellAcciones = row.insertCell(2);

            cellMaterial.textContent = material;
            cellEspesor.textContent = espesor;
            cellAcciones.innerHTML = '<button class="btnEliminar" title="Eliminar"><i class="fas fa-trash-alt"></i></button>';

            espesorInput.value = '';

            // Add event listeners for drag & drop
            addDragAndDropHandlers(row);
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

    function addDragAndDropHandlers(row) {
        let draggingElement;

        function handleDragStart(event) {
            draggingElement = row;
            row.classList.add('dragging');
        }

        function handleDragEnd() {
            draggingElement.classList.remove('dragging');
            draggingElement = null;
        }

        function handleDragOver(event) {
            event.preventDefault();
            const afterElement = getDragAfterElement(dataTable, event.clientY);
            if (afterElement == null) {
                dataTable.appendChild(draggingElement);
            } else {
                dataTable.insertBefore(draggingElement, afterElement);
            }
        }

        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragend', handleDragEnd);
        dataTable.addEventListener('dragover', handleDragOver);

        // Touch event handlers for mobile devices
        row.addEventListener('touchstart', handleTouchStart);
        row.addEventListener('touchmove', handleTouchMove);
        row.addEventListener('touchend', handleTouchEnd);

        function handleTouchStart(event) {
            event.preventDefault();
            handleDragStart(event.touches[0]);
        }

        function handleTouchMove(event) {
            event.preventDefault();
            handleDragOver(event.touches[0]);
        }

        function handleTouchEnd(event) {
            event.preventDefault();
            handleDragEnd();
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('tr[draggable]:not(.dragging)')];

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
