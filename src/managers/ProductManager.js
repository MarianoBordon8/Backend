const fs = require('fs');


class ProductManager{
    constructor() {
        this.products = []
        this.path = './src/productos.txt'
        this.idAgregar = 1
    }
    async getProducts(){
        let obtainProducts
        const Existe = fs.existsSync(this.path)
        if (!Existe) {
            obtainProducts = []
        } else {
            obtainProducts = await fs.promises.readFile(this.path, 'utf-8')
            obtainProducts = JSON.parse(obtainProducts)
        }
        this.products = obtainProducts
        return obtainProducts
    }

    async addProduct({title, description, price, thumbnail, code, stock}){
        if (!title || !description || !price || !thumbnail || !code || !stock){
            return ('faltan campos')
        }else{
            const codeEncontrado = this.products.find(prod => prod.code === code)
            if (codeEncontrado){
                return (`El codigo ${code} ya existe`)
            }else{
                this.idAgregar++
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    id: this.idAgregar,
                    code,
                    stock,
                    status: true
                }
                this.products.push(product)
                const productoString = JSON.stringify(this.products, null, 2)
                await fs.promises.writeFile(this.path, productoString)
                return ('se añadio correctamente')
            }
        }
    }
    async getProductById(id){
        let leerProductos = []
        leerProductos = await this.getProducts()
        const producto = leerProductos.find((prod) => prod.id === id)
        return(producto)
    }

    async deleteProduct (id) {
        let obtainProducts = await fs.promises.readFile(this.path, 'utf-8')
        obtainProducts = JSON.parse(obtainProducts)
        const i = obtainProducts.findIndex(elm => elm.id===id)

        if (i === -1) {
            return 'Producto no encontrado';
        } else {
            const newProducts = obtainProducts.filter((produc) => produc.id != id)
            this.products = newProducts
            const jsonProduct = JSON.stringify(newProducts, null, 2)
            await fs.promises.writeFile(this.path, jsonProduct)
            return 'Producto eliminado correctamente'
        }
    }

    async updateProduct(id, data) {
        let obtainProducts = await fs.promises.readFile(this.path, 'utf-8')
        obtainProducts = JSON.parse(obtainProducts)
        let indice = obtainProducts.findIndex(prod => prod.id === parseInt(id));

        if (indice !== -1) {
            obtainProducts[indice] = { ...obtainProducts[indice], ...data, id };
            const productoString = JSON.stringify(obtainProducts, null, 2)
            await fs.promises.writeFile(this.path, productoString)
            this.products = obtainProducts
            return('se actualizo correctamente')
        } else {
            return('Product not found');
        }
    }
}

module.exports = ProductManager;