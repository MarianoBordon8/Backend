import React from 'react'


const productDetail = ({product}) => {
  return (
    <div>
        <h1>{product.title}</h1>
        <h2>Descripcion: {product.description}</h2>
        <h3>Precio: {product.price}</h3>
    </div>
  )
}

export default productDetail