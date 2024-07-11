
const socket = io();

// Función para agregar un producto a la lista de productos
function addProductToList(productos) {
    console.log("esto recibe de", productos);
    const productList = document.getElementById('productList');
    // Limpiar la lista antes de agregar nuevos elementos
    productList.innerHTML = '';
    if (Array.isArray(productos)) {
        productos.forEach(producto => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${producto._id} -- Nombre: ${producto.title}`;
            productList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${productos._id} -- Nombre: ${productos.title}`;
        productList.appendChild(listItem);
    }
}

// Función para cargar la lista de productos cuando la página se carga inicialmente
function loadInitialProductList() {
    fetch('api/products') // Hacer una solicitud HTTP GET al servidor para obtener los productos
        .then(response => response.json())
        .then(productos => {
            productos.forEach(product => {
                addProductToList(productos);
            });
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}


// Escuchar el evento 'productAdded' y actualizar la lista de productos
socket.on('productAdded', (productos) => {
    console.log("13// esto escuhca", productos)
    addProductToList(productos);
});

// Escuchar el evento 'productDeleted' y actualizar la lista de productos
socket.on('idDeleted', (productId) => {
    console.log("16//este es el id", productId)
    const productList = document.getElementById('productList');
    const items = productList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent.includes(productId)) {
            productList.removeChild(items[i]);
            break;
        }
    }
});

// Cargar la lista de productos cuando la página se carga inicialmente
document.addEventListener('DOMContentLoaded', loadInitialProductList);

// Manejar el envío del formulario para agregar un nuevo producto
document.getElementById('productForm').addEventListener('submit', async (event) => {
    console.log('Evento submit detectado');
    event.preventDefault();
    const formData = new FormData(event.target);
    const newProduct = {};

    // Recopilar los datos del formulario en newProduct
    formData.forEach((value, key) => {
        newProduct[key] = value;
    });

    // Imprimir los datos del nuevo producto en la consola
    console.log('Datos del nuevo producto:', newProduct);

    // Enviar datos del nuevo producto al servidor API
    await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    });

    // Emitir evento al servidor Socket.IO después de enviar los datos al servidor API
    socket.emit('productAdded', newProduct);
    console.log('6// Datos del nuevo producto: emitido', newProduct);

    // Limpiar los campos del formulario
    document.getElementById('productForm').reset();
});

// Manejar el clic del botón para eliminar un producto
document.getElementById('deleteProductBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    const productId = document.getElementById('productId').value;

    console.log('ID del producto a eliminar:', productId);
    // Emitir evento al servidor Socket.IO del producto a eliminar el producto
    socket.emit('productDeleted', productId);
    console.log('//20 esto se esta emitiendo', productId);

    // Enviar el ID del producto al servidor para eliminarlo
    await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
    });

    console.log("id para eleiminar", productId)

    // Emitir evento al servidor Socket.IO después de eliminar el producto
    socket.emit('productDeleted', productId);

    console.log("id para eleiminar", productId)

    // Limpiar el campo del formulario
    document.getElementById('deleteForm').reset();
});