class CartRepository{
    constructor(dao){
        this.dao =  dao
    }
    getCart = async (cid) => await this.dao.getBy(cid)
    getCarts = async() => await this.dao.gets()
    createCart = async () => await this.dao.create()
    createProductByCart = async (cid, pid) => await this.dao.add(cid, pid)
    updateCart = async (cid, data) => await this.dao.update(cid, data)
    updateProductByCart = async (cid, pid, newCantidad) => await this.dao.updateProductByCart(cid, pid, newCantidad)
    deleteCart = async (cid) => await this.dao.delete(cid)
    deleteProductByCart = async (cid, pid) => await this.dao.deleteProductByCart(cid, pid)
}

module.exports =  {CartRepository}