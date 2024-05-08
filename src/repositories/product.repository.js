class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async (opcionesPaginacion) => await this.dao.get(opcionesPaginacion)
    getProduct = async (filter) => await this.dao.getBy(filter)
    createProduct = async (newProduct, email) => await this.dao.create(newProduct, email)
    updateProduct = async (filter, data) => await this.dao.update(filter, data)
    deleteProduct = async (filter) => await this.dao.delete(filter)
    mock = async () => await this.dao.mock()
}

module.exports =  {ProductRepository}