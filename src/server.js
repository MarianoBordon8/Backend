const express = require('express');
const productsRouter = require('./routes/products.router.js')
const cartRouter = require('./routes/carts.router.js')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

app.listen(8080, () => {
    console.log('funciono');
});
