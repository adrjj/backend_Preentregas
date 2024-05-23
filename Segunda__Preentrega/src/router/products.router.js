const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/productManagerDb");
const manager = new ProductManager();



router.post('/', async (req, res) => {

    try {
        const { title, description, price, thumbnail, code, stock, category, status } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }
        await manager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.status(201).json({ message: "Producto agregado exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let sortQuery = {};

        // Verifica si se ha especificado un parámetro sort y configura la ordenación en consecuencia
        if (req.query.sort === 'price') {
            sortQuery = { price: 1 }; // Ordena por precio de menor a mayor
        } else if (req.query.sort === '-price') {
            sortQuery = { price: -1 }; // Ordena por precio de mayor a menor
        }
        
     
        const { sort, ...query } = req.query;
        console.log(" 5//req.query",  req.query);
        // 5// Query Params: { limit: '10', page: '2', sort: '-price' }
        // Llama a getProduct() con la consulta y la ordenación adecuada
        const result = await manager.getProduct({ ...query, sort: sortQuery });
        console.log(" 6// Query Params:", { ...query, sort: sortQuery });
       // 6// Query Params: { limit: '10', page: '2', sort: { price: -1 } }
        console.log("//2 esto imprime", query  ,"y esto sortQuery",sortQuery)
       //2 esto imprime { limit: '10', page: '2' } y esto sortQuery { price: -1 }

       

        const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, page } = result;

        res.json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `?limit=${req.query.limit || 10}&page=${prevPage}&sort=${req.query.sort || ''}` : null,
            nextLink: hasNextPage ? `?limit=${req.query.limit || 10}&page=${nextPage}&sort=${req.query.sort || ''}` : null

        });
    } catch (error) {
        res.status(500).json({ error: "Error al recuperar productos.", message: error.message });
    }
    /* try {

        const productos = await manager.loadProducts();
        res.status(200).json(productos);
       
    } catch (error) {
        res.status(500).json({ error: "Error al recuperar productos.", message: error.message });
    }*/
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await manager.getProductsById(id);
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error al recuperar el producto.", message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        await manager.updateProduct(id, newData);
        res.status(200).json({ message: "Producto actualizado exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto.", message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await manager.deleteProduct(id);
        res.status(200).json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto.", message: error.message });
    }
});







module.exports = router;
