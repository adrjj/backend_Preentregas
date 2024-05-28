
const productModel = require("./models/products.model.js")

class ProductManager {

   /* async getProduct(queryParams) {
        console.log("//3 esto imprime",queryParams)
        //3 esto imprime { limit: '10', page: '2', sort: { price: -1 } }
       
        const { limit = 10, page = 1, sort= {}, query } = queryParams;
        console.log("//7 esto imprime",queryParams)
       //7 esto imprime { limit: '10', page: '2', sort: { price: -1 } }
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort:  Object.keys(sort).length > 0 ? sort : undefined 
        };
        console.log("//9 esto imprime options",options.sort)
       //9 esto imprime options { limit: 10, page: 2, sort: {} }  
        console.log("//1 esto imprime sort",sort, "y tambien query", query)
        //1 esto imprime sort { price: -1 } y tambien query undefined  
        const queryObject = query ? JSON.parse(query) : {};
     
        try {
            const result = await productModel.paginate(queryObject, options);
            console.log("//4 esto imprime queryObject",queryObject, "y tambien options", options)
            //4 esto imprime queryObject {} y tambien options { limit: 10, page: 2, sort: {} }
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }*/
    async getProduct(queryParams) {
        const { limit = 10, page = 1, sort = {}, filter = {} } = queryParams;
        
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: Object.keys(sort).length > 0 ? sort : undefined 
        };
    
        try {
            const result = await productModel.paginate(filter, options);
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    


    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        try {
            const newProduct = new productModel({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status: true,
                category
            });
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    }

    async getProductsById(_id) {
        try {
            const product = await productModel.findById(_id);
            if (!product) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(_id, newData) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(_id, newData, { new: true });
            if (!updatedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(_id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(_id);
            if (!deletedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }


    async loadProducts() {
        try {
            const products = await productModel.find();
            //  console.log("Estos son los datos que se cargan:", products);
            return products.map(product => ({
                title: product.title,
                price: product.price,
                description:product.description,
                thumbnail:product.thumbnail,
                code:product.code,
                stock:product.stock,
                category:product.category,
                status:product.status,
                id:product._id




            }));

        } catch (error) {
            throw new Error("Error al cargar los productos: " + error.message);
        }
    }
}

module.exports = ProductManager;

