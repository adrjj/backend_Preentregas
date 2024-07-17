


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


document.querySelectorAll('.BotonEliminar').forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = button.getAttribute('data-product-id'); // Obtener el ID del producto desde el atributo data
        const cartId = button.getAttribute('data-user-id'); // Obtener el ID del carrito desde el atributo data
        console.log ("12// cartID",cartId,"productId",productId)
        if (!productId || !cartId) {
            console.error('Product ID or Cart ID is missing');
            return;
        }

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Producto eliminado correctamente.');
                // Realizar acciones adicionales si es necesario, como actualizar la UI, etc.
            } else {
                console.error('Error al eliminar el producto del carrito.');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
