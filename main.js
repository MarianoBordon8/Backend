const fs = require('fs');


class ProductManager{
    constructor() {
        this.products = []
        this.path = "productos.txt"
    }
    static id = 0
        async getProducts(){
        let obtainProducts
        const Existe = fs.existsSync(this.path)
        if (!Existe) {
            obtainProducts = []
        } else {
            obtainProducts = await fs.promises.readFile(this.path, "utf-8")
            obtainProducts = JSON.parse(obtainProducts)
        }
        this.products = obtainProducts
        return obtainProducts
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock){
            console.log("faltan campos")
        }else{
            const codeEncontrado = this.products.find(prod => prod.code === code)
            if (codeEncontrado){
                console.log(`El codigo ${code} ya existe`)
            }else{
                ProductManager.id++
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    id: ProductManager.id,
                    code,
                    stock,
                }
                this.products.push(product)
                const productoString = JSON.stringify(this.products, null, 2)
                await fs.promises.writeFile(this.path, productoString)
            }
        }
    }
    async getProductById(id){
        let leerProductos = []
        leerProductos = await this.getProducts()

        const producto = leerProductos.find((prod) => prod.id === id)
        if(producto){
            console.log(producto)
        }else{
            console.log("no se encontro")
        }
    }

    async deleteProduct (id) {
        const i = this.products.findIndex(elm => elm.id===id)

        if (i === -1) {
            return "Producto no encontrado";
        } else {
            const newProducts = this.products.filter((produc) => produc.id != id)
            this.products = newProducts
            const jsonProduct = JSON.stringify(this.products, null, 2)
            await fs.promises.writeFile(this.path, jsonProduct)
            return this.products
        }
    }

    async updateProduct(id, data) {
        let indice = this.products.findIndex(prod => prod.id === id);

        if (indice !== -1) {
            this.products[indice] = { ...this.products[indice], ...data, id };
            const productoString = JSON.stringify(this.products, null, 2)
            await fs.promises.writeFile(this.path, productoString)
        } else {
            console.log("Product not found");
        }
    }
}

const product = new ProductManager()