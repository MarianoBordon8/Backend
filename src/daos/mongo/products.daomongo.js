const { productModel } = require('../../models/products.model')

class ProductDaoMongo {
    constructor() {
        this.model = productModel
    }

    getProducts = async () => {
        try {
            return await this.model.find()
        } catch (error) {
            console.log(error)
        }
    }

    getProductsById = async (pid) => {
        try {
            return await this.model.find({ _id: pid})
        } catch (error) {
            console.log(error)
        }
    }

    addProduct = async ({ title, description, price, thumbnail , code, stock }) => {
        try {
            if ( !title || !description || !price || !thumbnail || !code || !stock) {
                return 'ERROR: debe completar todos los campos'
            }else{
                const codeEncontrado = await this.model.findOne({code: code})
                if (codeEncontrado){
                    return (`El codigo ${code} ya existe`)
                }else{
                    const newProduct = {
                        title,
                        description,
                        code,
                        price,
                        status: true,
                        stock,
                        thumbnail,
                    }
                    await this.model.create(newProduct)
                    return 'se agrego correctamente'
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (pid, data) => {
        try {
            return await this.model.updateOne({_id: pid}, data)
        } catch (error) {
            console.log(error)
        }
    }

    deleteProductById = async (pid) => {
        try {
            return await this.model.deleteOne({_id: pid})
        } catch (error) {
            console.log(error)
        }
    }
}

exports.ProductMongo = ProductDaoMongo