import React from 'react';
import axios from 'axios';
import ProductForm from './components/ProductForm';

function App() {
  const addProduct = async (product) => {
    try {
      await axios.post('http://localhost:8080/api/products', product);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="app">
      <h1>Product Manager</h1>
      <ProductForm addProduct={addProduct} />
    </div>
  );
}

export default App;