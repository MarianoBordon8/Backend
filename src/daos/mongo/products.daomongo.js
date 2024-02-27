const { productModel } = require('../../models/products.model')

class ProductDaoMongo {
    constructor() {
        this.model = productModel
    }

    get = async (opcionesPaginacion) => {
        try {
            return await this.model.paginate({}, opcionesPaginacion)
        } catch (error) {
            console.log(error)
        }
    }

    getBy = async (filter) => {
        try {
            return await this.model.find(filter)
        } catch (error) {
            console.log(error)
        }
    }

    create = async ({ title, description, price, thumbnail , code, stock, categoria }) => {
        try {
            if ( !title || !description || !price || !thumbnail || !code || !stock || !categoria) {
                return 'ERROR: debe completar todos los campos'
            }else{
                const codeEncontrado = await this.model.findOne({code: code})
                if (codeEncontrado){
                    return (`El codigo ${code} ya existe`)
                }else{
                    const newProduct = {
                        categoria: categoria,
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

    update = async (filter, data) => {
        try {
            return await this.model.updateOne(filter, data)
        } catch (error) {
            console.log(error)
        }
    }

    delete = async (filter) => {
        try {
            return await this.model.deleteOne(filter)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductDaoMongo
