class CartRepository{
    constructor(dao){
        this.dao =  dao
    }
    getCart = async (cid) => await this.dao.getBy(cid)
    createCart = async (newCart) => await this.dao.create(newCart)
    createProductByCart = async (cid, pid) => await this.dao.addProductToCart(cid, pid)
    updateCart = async (cid, data) => await this.dao.update(cid, data)
    updateProductByCart = async (cid, pid, newCantidad) => await this.dao.updateProductByCart(cid, pid, newCantidad)
    deleteCart = async (cid) => await this.dao.delete(cid)
    deleteProductByCart = async (cid, pid) => await this.dao.deleteProductByCart(cid, pid)
}

module.exports =  {CartRepository}