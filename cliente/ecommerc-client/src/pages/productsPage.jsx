import React from 'react'

import { useEffect, useState } from "react"
import ProductsList from '../components/productsList/productsList'
//import  productsList  from '../components/productsList/productsList.jsx'


export const ProductsPage = () => {

    const [products, setProducts] = useState([])
    useEffect(() => {
        const getProducts = async () => {
            const dataJson = await fetch('http://localhost:8080/api/products')
            const data = await dataJson.json()
            setProducts(data.payload)
        }
        getProducts()
    }, [])



    return (
        <div>
            <ProductsList products={products}/>
        </div>
    )
}

