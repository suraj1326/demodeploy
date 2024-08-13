import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './PurchaseList.css';

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [purchasesPerPage] = useState(7);
  const [selectedId, setSelectedId] = useState(null); // State to store selected ID

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (selectedId) {
      fetchPurchaseById(selectedId);
    } else {
      fetchPurchases();
    }
  }, [selectedId]);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:3000/wala/shala/purchases');
      console.log(response.data); // Debug: check the fetched data
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error.response ? error.response.data : error.message);
    }
  };

  const fetchPurchaseById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/wala/shala/purchases/${id}`);
      console.log(response.data); // Debug: check the fetched data for specific ID
      setPurchases([response.data]); // Assuming you only fetch one purchase, wrap it in an array
    } catch (error) {
      console.error('Error fetching purchase by ID:', error.response ? error.response.data : error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filterPurchases = (purchases, query) => {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery.trim() === '') return purchases;

    return purchases.filter(purchase =>
      purchase.supplier_name.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredPurchases = filterPurchases(purchases, searchQuery);

  // Pagination logic
  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPurchases.length / purchasesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePrintBillClick = (purchaseId) => {
    setSelectedId(purchaseId); // Set the selected ID
    navigate(`/Component/Branch1/PurchaseDetails/PurchaseDetails/${purchaseId}`);
  };

  return (
    <div className="purchase-container">
      <Link to="/Component/Branch1/AddPurchase/AddPurchase" className="add-purchase-link">New Purchase</Link>
      
      <div className="heading-search-container">
        <h1 className="purchase-heading">Purchase List</h1>
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by supplier name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <table className="purchase-table">
        <thead className="purchase-table-head">
          <tr>
            <th className="purchase-table-th">Purchase Date</th>
            <th className="purchase-table-th">Supplier Name</th>
            <th className="purchase-table-th">Supplier Phone Number</th>
            <th className="purchase-table-th">Purchase ID</th>
            <th className="purchase-table-th purchase-table-th-product-names">Product Names</th>
            <th className="purchase-table-th">Discount</th>
            <th className="purchase-table-th">Amount Paid</th>
            <th className="purchase-table-th">Payment Mode</th>
            <th className="purchase-table-th">Action</th>
          </tr>
        </thead>
        <tbody className="purchase-table-body">
          {currentPurchases.map((purchase, index) => (
            <tr className="purchase-table-tr" key={purchase.purchase_id}>
              <td className="purchase-table-td">{new Date(purchase.created_at).toLocaleDateString('en-GB')}</td>
              <td className="purchase-table-td">{purchase.supplier_name}</td>
              <td className="purchase-table-td">{purchase.supplier_phone}</td>
              <td className="purchase-table-td">{purchase.purchase_id}</td>
              <td className="purchase-table-td purchase-table-td-product-names">{purchase.product_names}</td>
              <td className="purchase-table-td">{purchase.order_discount}</td>
              <td className="purchase-table-td">{purchase.paid}</td>
              <td className="purchase-table-td">{purchase.payment_method}</td>
              <td className="purchase-table-td" id={`purchase-table-td-action-${purchase.purchase_id}`}>
                <button className='bl' onClick={() => handlePrintBillClick(purchase.purchase_id)}>
                  Print Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="footer-container">
        <div className="pagination">
          <ul className="pagination-list">
            <li className="pagination-item">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
            </li>
            {pageNumbers.map(number => (
              <li className="pagination-item" key={number}>
                <button
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}
            <li className="pagination-item">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
              >
                &gt;
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;
