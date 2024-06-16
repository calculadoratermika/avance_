document.addEventListener('DOMContentLoaded', function() {
    const materialContainer = document.getElementById('material-container');
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
                        const materialItem = document.createElement('div');
                        materialItem.textContent = material;
                        materialItem.draggable = true;
                        materialItem.classList.add('material-item');
                        materialContainer.appendChild(materialItem);
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
        const selectedMaterial = document.querySelector('.material-item.selected');

        if (selectedMaterial && espesor !== '') {
            const material = selectedMaterial.textContent;
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

    // Drag and drop
    materialContainer.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
    });

    materialContainer.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    materialContainer.addEventListener('drop', function(event) {
        event.preventDefault();
        const material = event.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`.material-item:contains('${material}')`);
        if (draggedElement) {
            materialContainer.removeChild(draggedElement);
            materialContainer.appendChild(draggedElement);
        }
    });

    materialContainer.addEventListener('dragend', function(event) {
        event.preventDefault();
        const material = event.dataTransfer.getData('text/plain');
        const draggedElement = Array.from(materialContainer.children).find(
            item => item.textContent === material
        );
        if (draggedElement) {
            draggedElement.remove();
        }
    });

    // Selección de material
    materialContainer.addEventListener('click', function(event) {
        const selectedElement = event.target;
        if (selectedElement.classList.contains('material-item')) {
            document.querySelectorAll('.material-item').forEach(item => item.classList.remove('selected'));
            selectedElement.classList.add('selected');
        }
    });
});
