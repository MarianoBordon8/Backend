class ProductManager{
    constructor() {
        this.products = []
        this.id = 1
    }
    getProducts(){
        console.log(this.products)
    }
    addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock){
            console.log("faltan campos")
        }else{
            if(this.products.length > 0){
                const codeEncontrado = this.products.find(prod => prod.code === code)
                if (codeEncontrado){
                    console.log("El codigo ya existe")
                }else{
                    this.id = (this.products[this.products.length - 1].id + 1)
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    id: this.id,
                    code,
                    stock,}
                this.products.push(product)
                }
            }else{
                this.id = 1
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    id: this.id,
                    stock,}
                this.products.push(product)
            }
        }
    }
    getProductById(id){
        const productEncontrado = this.products.find(prod => prod.id === id)
        if(!productEncontrado){
            console.log("Not found")
        }else{
            console.log(productEncontrado)
        }
    }
}

const product = new ProductManager()