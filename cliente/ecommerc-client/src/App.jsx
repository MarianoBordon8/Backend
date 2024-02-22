
import { ProductsPage } from './pages/productsPage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  

  return (
    <Router>
      <h1>Ecommerce</h1>
      <Routes>
        <Route path='/' element={<ProductsPage />} />
        <Route path='/detalle/:pid' element={<ProductDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
