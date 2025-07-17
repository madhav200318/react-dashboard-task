// DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import CreateProductModal from './CreateProductModal.js';
import './DashboardPage.css';

function DashboardPage({ userId, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Removed unused state variables: showProductsFilter, setShowProductsFilter, sortOrder, setSortOrder

  const fetchProducts = useCallback(async () => { // Wrapped fetchProducts in useCallback
    if (!userId) {
      setError('User ID is required to fetch products.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://devservice.teemify.ai/list_products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const data = await response.json();
      console.log('List Products API Response:', data);

      if (response.ok) {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn('No products found or unexpected response structure:', data);
          setProducts([]);
        }
      } else {
        setError(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Network error or failed to connect to the API.');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Added userId to useCallback dependencies

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId, fetchProducts]); // Added fetchProducts to useEffect dependencies

  const handleProductCreated = () => {
    setIsModalOpen(false);
    fetchProducts(); // Refresh the product list after creating a new product
  };

  const handleDeleteProduct = (productId) => {
    console.log(`Simulating deletion of product with ID: ${productId}`);
    setProducts(products.filter(product => product.product_id !== productId));
    alert(`Product with ID ${productId} has been "deleted" (simulated).`);
  };

  const handleEditProduct = (productId) => {
    alert(`Simulating edit for product with ID: ${productId}`);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_color?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">Teemify</div>
        <nav className="sidebar-nav">
          <ul>
            {/* Changed <a> to <button> for navigation items as they don't lead to new URLs */}
            <li className="nav-item">
              <button className="nav-link">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 001 1h3m-6-10v6a1 1 0 001 1h2a1 1 0 001-1v-6"></path></svg>
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link active">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                Products
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m3 2v-2M9 10a6 6 0 016 6v2a2 2 0 002 2h2a2 0 002-2v-2a6 6 0 01-6-6V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a6 6 0 016 6v2a2 2 0 002 2h2a2 2 0 002-2v-2a6 6 0 01-6-6z"></path></svg>
                Customers
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 0112 2c4.97 0 9 3.582 9 8z"></path></svg>
                Messages
              </button>
            </li>
          </ul>
        </nav>
        <button onClick={onLogout} className="logout-button">
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="top-header-left">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="top-header-right">
            <button className="notification-button">
              <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"></path></svg>
            </button>
            <div className="user-profile">
              <img src="https://i.postimg.cc/BjYVvQzM/user.jpg" alt="User Avatar" className="user-avatar" />
              <span className="user-name">Estiaq Noor</span>
              <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </header>

        <section className="product-management-section">
          <div className="product-list-header">
            <h2 className="section-title">Product List</h2>
            <div className="filter-controls">
              <div className="dropdown-wrapper">
                <select className="filter-dropdown">
                  <option>Category (132)</option>
                  <option>Jackets (132)</option>
                </select>
                <div className="dropdown-arrow-icon">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="dropdown-wrapper">
                <select className="filter-dropdown">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="dropdown-arrow-icon">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="dropdown-wrapper">
                <select className="filter-dropdown">
                  <option>$50 - $100</option>
                  <option>All Prices</option>
                </select>
                <div className="dropdown-arrow-icon">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="dropdown-wrapper">
                <select className="filter-dropdown">
                  <option>All Store</option>
                  <option>Store A</option>
                  <option>Store B</option>
                </select>
                <div className="dropdown-arrow-icon">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <button className="filter-button">
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filter
              </button>
              <button onClick={() => setIsModalOpen(true)} className="add-product-button">
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add Product
              </button>
              <button onClick={fetchProducts} className="filter-button" style={{ marginLeft: '0.5rem' }}>
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">Loading products...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={fetchProducts} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', backgroundColor: '#613cea', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-message">
              {searchTerm ? `No products found matching "${searchTerm}".` : 'No products found. Add some!'}
            </div>
          ) : (
            <div className="table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Purchase Unit Price</th>
                    <th>Products</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.product_id || product._id || product.product_name}>
                      <td className="product-name-cell">
                        <img
                          src={product.imageUrl || product.image_url || `https://placehold.co/40x40/f3f3f3/000?text=${encodeURIComponent(product.product_name?.substring(0,2) || 'PR')}`}
                          alt={product.product_name || 'Product'}
                          className="product-image"
                        />
                        <div>
                          {product.product_name || 'Unnamed Product'}
                          <div className="product-sku">{product.product_description || product.sku || 'No description'}</div>
                        </div>
                      </td>
                      <td>${product.product_price ? parseFloat(product.product_price).toFixed(2) : 'N/A'}</td>
                      <td>{product.products_count || product.stock_count || 'N/A'}</td>
                      <td>{product.views || product.view_count || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${(product.status === 'Active' || product.status === 'active') ? 'status-active' : 'status-inactive'}`}>
                          <span className="status-dot" style={{ backgroundColor: (product.status === 'Active' || product.status === 'active') ? '#1dd188' : '#888' }}></span>
                          {product.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEditProduct(product.product_id || product._id || product.product_name)} className="action-button edit-button">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(product.product_id || product._id || product.product_name)} className="action-button delete-button">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="pagination-container">
          <span>1 - {filteredProducts.length} of {filteredProducts.length}</span>
          <div className="pagination-buttons">
            <button className="pagination-button">&lt;</button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">...</button>
            <button className="pagination-button">24</button>
            <button className="pagination-button">&gt;</button>
          </div>
        </div>

        {isModalOpen && (
          <CreateProductModal
            userId={userId}
            onClose={() => setIsModalOpen(false)}
            onProductCreated={handleProductCreated}
          />
        )}
      </main>
    </div>
  );
}

export default DashboardPage;