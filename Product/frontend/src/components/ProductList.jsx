import React from 'react';

function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;