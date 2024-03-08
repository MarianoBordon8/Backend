const { faker } = require('@faker-js/faker')
const { productModel } = require('../../models/products.model')
const { logger } = require('../../utils/logger')

class ProductDaoMongo {
    constructor() {
        this.model = productModel
    }

    get = async (opcionesPaginacion) => {
        return await this.model.paginate({}, opcionesPaginacion)
    }

    getBy = async (filter) => {
        return await this.model.find(filter)
    }

    create = async ({ title, description, price, thumbnail , code, stock, categoria }) => {
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
    }

    update = async (filter, data) => {
        return await this.model.updateOne(filter, data)
    }

    delete = async (filter) => {
        return await this.model.deleteOne(filter)
    }

    mock = () => {
        let productsM = []
        for (let i = 0; i < 100; i++) {
            productsM.push({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                status: true,
                price: faker.commerce.price(),
                code: `codigo${i}`,
                stock: faker.string.numeric(),
                thumbnail: faker.image.url(),
                id: faker.database.mongodbObjectId()
            })
        }
        return productsM
    }
}

module.exports = ProductDaoMongo
