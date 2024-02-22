import React from 'react'
import productCard from '../productCart/productCard'

const productsList = ({products}) => {
  return (
    <div>
        {products.map(product => <productCard key={product._id} product={product}/>)}
    </div>
  )
}

export default {productsList}