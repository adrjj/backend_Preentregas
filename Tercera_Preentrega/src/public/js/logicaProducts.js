


document.querySelectorAll('.BotonAgregar').forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = button.getAttribute('data-product-id'); // Obtener el ID del producto desde el atributo data
        console.log('ID del producto:', productId);

        const productos = [{ pid: productId, quantity: 1 }];

        // Enviar el ID del producto al servidor API
        try {
            const response = await fetch(`/api/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productos,}),
            });
            console.log("//1",productos)
            if (response.ok) {
                console.log('Producto agregado al carrito correctamente.');
                // Realizar acciones adicionales si es necesario, como actualizar la UI, etc.
            } else {
                console.error('Error al agregar el producto al carrito.');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});