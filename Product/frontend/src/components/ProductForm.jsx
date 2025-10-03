import React, { useState } from 'react';

function ProductForm({ addProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && price) {
      addProduct({ name, price: parseFloat(price) });
      setName('');
      setPrice('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        step="0.01"
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;