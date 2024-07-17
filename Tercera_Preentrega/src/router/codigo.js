router.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;
    console.log("01//cartId",cartId)
    

    try {
        // Buscar el carrito por su ID
        const cart = await Cart.findById(cartId).populate('products.product');
        console.log("01//cartId",cartId)
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Verificar y actualizar el stock de cada producto en el carrito
        const productsToUpdate = [];
        let canPurchase = true;

        for (const item of cart.products) {
            const product = item.product;
            const quantityInCart = item.quantity;

            if (product.stock >= quantityInCart) {
                // Restar la cantidad comprada del stock del producto
                product.stock -= quantityInCart;
                productsToUpdate.push(product);
            } else {
                canPurchase = false;
                break; // Si un producto no tiene suficiente stock, detener el proceso
            }
        }

        if (!canPurchase) {
            return res.status(400).json({ error: 'No hay suficiente stock para completar la compra' });
        }

        // Actualizar el stock de todos los productos en la base de datos
        await Promise.all(productsToUpdate.map(product => product.save()));

        // Crear un nuevo ticket de compra
        const ticket = new Ticket({
            code: generateUniqueTicketCode(), // Función para generar un código único de ticket
            amount: calculateTotalAmount(cart.products), // Función para calcular el total de la compra
            purchaser: cart.userEmail // Obtener el correo del usuario desde el carrito
        });

        // Guardar el ticket en la base de datos
        await ticket.save();

        // Eliminar el carrito de la base de datos
        await cart.remove();

        // Respuesta exitosa
        res.json({ message: 'Compra realizada exitosamente', ticket });
        
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});

// Función para generar un código único de ticket (ejemplo)
function generateUniqueTicketCode() {
    // Implementa aquí la lógica para generar un código único, por ejemplo, usando UUID o algún otro método seguro.
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Función para calcular el total de la compra
function calculateTotalAmount(products) {
    // Implementa aquí la lógica para calcular el total de la compra basado en los productos del carrito.
    let total = 0;
    for (const item of products) {
        total += item.product.price * item.quantity;
    }
    return total;
}

