import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import productDetail from "../components/productDetail/productDetail.jsx"

const productDetailPage = () => {
    const [product, setProduct] = useState({})
    const {pid} = useParams()

    useEffect(() => {
        const getProduct = async () => {
            const dataJson = await fetch(`http://localhost:8080/api/products/${pid}`)
            const data = await dataJson.json()
            setProduct(data.payload)
        }
        getProduct()
    }, [])
  return (
    <div>
        <productDetail/>
    </div>
  )
}

export default productDetailPage