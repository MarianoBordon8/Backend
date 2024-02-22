class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async () => await this.dao.gets()
    getProduct = async (filter) => await this.dao.get(filter)
    createProduct = async (newProduct) => await this.dao.create(newProduct)
    updateProduct = async (filter, data) => await this.dao.update(filter, data)
    deleteProduct = async (filter) => await this.dao.delete(filter)
}

module.exports =  {ProductRepository}