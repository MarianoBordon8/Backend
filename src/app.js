const express = require('express');
const ProductManager = require('./main');
const app = express();

app.use(express.urlencoded({ extended: true }));

const product = new ProductManager();

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    if (!limit){
        const productos = await product.getProducts();
        res.json(productos)
    }else{
        const productos = await product.getProducts()
        if(productos.length >= limit){
            const limitProducts = await productos.slice(0, limit);
            res.json(limitProducts);
        }else{
            res.send("Fuera de rango")
        }
    }

});

app.get('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const mostrar = await product.getProductById(pid);
    res.json(mostrar);
});

app.listen(8080, () => {
    console.log('funciono');
});
