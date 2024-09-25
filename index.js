
const materialesIniciales = {
    cinta_seguridad: { stock: 20, ultima_actualizacion: null },
    racor_recto: { stock: 100, ultima_actualizacion: null },
    racor_curvo: { stock: 50, ultima_actualizacion: null },
    buje: { stock: 75, ultima_actualizacion: null },
    acople: { stock: 30, ultima_actualizacion: null }
};

// Función para cargar los materiales desde localStorage o usar los valores iniciales
function cargarMateriales() {
    const materialesGuardados = localStorage.getItem('materiales');
    if (materialesGuardados) {
        return JSON.parse(materialesGuardados); // Si hay datos en localStorage, los cargamos
    }
    return materialesIniciales; // Si no hay datos, usamos los valores iniciales
}

const materiales = cargarMateriales();

// Guardar los materiales en localStorage
function guardarMateriales() {
    localStorage.setItem('materiales', JSON.stringify(materiales));
}

// Obtener elementos del DOM
const selectMaterial = document.getElementById('material-select');
const materialDetalles = document.getElementById('material-detalles');

// Rellenar el menú desplegable con los materiales
for (const material in materiales) {
    const option = document.createElement('option');
    option.value = material;
    option.textContent = material.replace(/_/g, ' ').toUpperCase();
    selectMaterial.appendChild(option);
}

// Escuchar el cambio en la selección del material
selectMaterial.addEventListener('change', function() {
    const selectedMaterial = selectMaterial.value;
    mostrarDetallesMaterial(selectedMaterial);
});

// Función para mostrar los detalles del material seleccionado
function mostrarDetallesMaterial(material) {
    if (!material) {
        materialDetalles.innerHTML = ''; // Limpiar el contenido si no hay material seleccionado
        return;
    }

    // Cargar los datos del material
    const stock = materiales[material]?.stock ?? 0; // Usar el valor de stock o 0 si no existe
    const ultimaActualizacion = materiales[material]?.ultima_actualizacion
        ? new Date(materiales[material].ultima_actualizacion).toLocaleString()
        : "Nunca";

    materialDetalles.innerHTML = `
        <div class="material-container">
            <p>Material: ${material.replace(/_/g, ' ').toUpperCase()}</p>
            <p>Stock Actual: <span id="${material}-stock">${stock}</span></p>
            <p>Última Actualización: <span id="${material}-ultima-actualizacion">${ultimaActualizacion}</span></p>

            <label for="${material}-input-uso">Cantidad utilizada: </label>
            <input type="number" id="${material}-input-uso" min="0">
            <button onclick="actualizarStock('${material}', 'uso')">Usar Stock</button>

            <label for="${material}-input-aumento">Cantidad recibida: </label>
            <input type="number" id="${material}-input-aumento" min="0">
            <button onclick="actualizarStock('${material}', 'aumento')">Aumentar Stock</button>

            <p class="error-message" id="${material}-error"></p>
        </div>
    `;
}

// Función para actualizar el stock
function actualizarStock(material, tipo) {
    const errorElement = document.getElementById(`${material}-error`);
    errorElement.textContent = ''; // Limpiar cualquier mensaje de error previo

    let inputValue;
    if (tipo === 'uso') {
        inputValue = document.getElementById(`${material}-input-uso`).value;
    } else {
        inputValue = document.getElementById(`${material}-input-aumento`).value;
    }

    const cantidad = parseInt(inputValue);

    if (isNaN(cantidad) || cantidad < 0) {
        errorElement.textContent = "Por favor ingresa un valor válido.";
        return;
    }

    if (tipo === 'uso') {
        if (cantidad > materiales[material].stock) {
            errorElement.textContent = "No puedes utilizar más de lo que tienes en stock.";
            return;
        }

        // Restar la cantidad utilizada del stock
        materiales[material].stock -= cantidad;

    } else if (tipo === 'aumento') {
        // Aumentar el stock
        materiales[material].stock += cantidad;
    }

    // Actualizar la fecha de la última modificación
    materiales[material].ultima_actualizacion = new Date().toISOString();

    // Guardar los cambios en localStorage
    guardarMateriales();

    // Actualizar el DOM
    document.getElementById(`${material}-stock`).textContent = materiales[material].stock;

    // Actualizar la última actualización en el DOM
    const ultimaActualizacion = materiales[material].ultima_actualizacion 
        ? new Date(materiales[material].ultima_actualizacion).toLocaleString() 
        : "Nunca";
    document.getElementById(`${material}-ultima-actualizacion`).textContent = ultimaActualizacion;

    // Limpiar el campo de entrada después de la actualización
    document.getElementById(`${material}-input-uso`).value = '';
    document.getElementById(`${material}-input-aumento`).value = '';
}

// Inicializar mostrando el primer material (si hay alguno seleccionado)
if (selectMaterial.value) {
    mostrarDetallesMaterial(selectMaterial.value);
}