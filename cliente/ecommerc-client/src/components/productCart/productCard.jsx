import React from 'react'

const productCard = (product) => {
    return (
        <div className="card w-25 m-3">
            <div className="card-body">
                <img src={product.thumbnail} alt="imagen" />
                <h3>{product.title}</h3>
                <h3>{product.description}</h3>
                <h3>{product.price}</h3>
            </div>
            <div className="card-footer">
                <link to={`/detalle${product._id}`} className="btn btn-outline-dark w-100">Detalle</link>
            </div>
        </div>
    )
}
export default productCard
