class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async () => await this.dao.get()
    getProduct = async (filter) => await this.dao.getBy(filter)
    createProduct = async (newProduct) => await this.dao.create(newProduct)
    updateProduct = async (filter, data) => await this.dao.update(filter, data)
    deleteProduct = async (filter) => await this.dao.delete(filter)
    mock = async () => await this.dao.mock()
}

module.exports =  {ProductRepository}