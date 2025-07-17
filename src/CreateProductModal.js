// CreateProductModal.js
import React, { useState } from 'react';
import './CreateProductModal.css'; // Import the CSS for CreateProductModal

function CreateProductModal({ userId, onClose, onProductCreated }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productColor, setProductColor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productName || !productPrice || !productDescription || !productColor) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(productPrice) || parseFloat(productPrice) <= 0) {
      setError('Product price must be a positive number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://devservice.teemify.ai/create_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          product_price: parseFloat(productPrice),
          product_description: productDescription,
          product_color: productColor,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product created successfully!');
        onProductCreated();
      } else {
        setError(data.message || 'Failed to create product.');
      }
    } catch (err) {
      setError('Network error or failed to connect to create product API.');
      console.error('Create product error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Create New Product</h2>
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Wireless Headphones"
            />
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Price ($)</label>
            <input
              type="number"
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="e.g., 99.99"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="A brief description of the product..."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="productColor">Color</label>
            <input
              type="text"
              id="productColor"
              value={productColor}
              onChange={(e) => setProductColor(e.target.value)}
              placeholder="e.g., Black, Blue, Red"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`modal-create-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductModal;
