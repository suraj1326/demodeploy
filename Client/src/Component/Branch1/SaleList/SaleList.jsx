import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SaleList.css';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:3000/shala/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSales();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filterSales = (sales, query) => {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery.trim() === '') return sales;

    return sales.filter(sale =>
      sale.customer_name.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredSales = filterSales(sales, searchQuery);

  // Pagination logic
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrintBillClick = (id) => {
    navigate(`/Component/Branch1/SaleDetails/SaleDetails/${id}`);
  };

  // Page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSales.length / salesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="sale-container">
      <Link to="/Component/Branch1/AddSale/AddSale" className="add-sale-link" id="add-sale-link">New Sale</Link>
      <h2 className='sale-heading'>Sale List</h2>
      {/* Search Bar */}
      <div className="search-container" id="search-container">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          id="search-input"
        />
      </div>
      
      <div>
        <table className="sale-table" id="sale-table">
        <thead className="sale-table-head" id="sale-table-head">
  <tr>
    <th className="sale-table-th" id="sale-table-th-id">ID</th>
    <th className="sale-table-th" id="sale-table-th-sales-date">Sales Date</th>
    <th className="sale-table-th" id="sale-table-th-customer-name">Customer Name</th>
    <th className="sale-table-th" id="sale-table-th-customer-phone-number">Customer Phone Number</th>
    <th className="sale-table-th" id="sale-table-th-sale-id">Sale ID</th>
    <th className="sale-table-th" id="sale-table-th-product-names">Product Names</th>
    <th className="sale-table-th" id="sale-table-th-discount">Discount</th>
    <th className="sale-table-th" id="sale-table-th-amount-paid">Amount Paid</th>
    <th className="sale-table-th" id="sale-table-th-payment-mode">Payment Mode</th>
    <th className="sale-table-th" id="sale-table-th-action">Action</th>
  </tr>
</thead>

          <tbody className="sale-table-body" id="sale-table-body">
            {currentSales.map((sale, index) => (
              <tr className="sale-table-tr" id={`sale-table-tr-${sale.sale_id}`} key={sale.sale_id}>
                <td className="sale-table-td" id={`sale-table-td-id-${sale.sale_id}`}>{index + 1 + indexOfFirstSale}</td>
                <td className="sale-table-td" id={`sale-table-td-sales-date-${sale.sale_id}`}>{new Date(sale.created_at).toLocaleDateString('en-GB')}</td>
                <td className="sale-table-td" id={`sale-table-td-customer-name-${sale.sale_id}`}>{sale.customer_name}</td>
                <td className="sale-table-td" id={`sale-table-td-customer-phone-number-${sale.sale_id}`}>{sale.customer_phone}</td>
                <td className="sale-table-td" id={`sale-table-td-sale-id-${sale.sale_id}`}>{sale.sale_id}</td>
                <td className="sale-table-td" id={`sale-table-td-product-names-${sale.sale_id}`}>{sale.product_names}</td>
                <td className="sale-table-td" id={`sale-table-td-discount-${sale.sale_id}`}>{sale.order_discount}</td>
                <td className="sale-table-td" id={`sale-table-td-amount-paid-${sale.sale_id}`}>{sale.paid}</td>
                <td className="sale-table-td" id={`sale-table-td-payment-mode-${sale.sale_id}`}>{sale.payment_method}</td>
                <td className="sale-table-td" id={`sale-table-td-action-${sale.id}`}>
                  <button className='bl' onClick={() => handlePrintBillClick(sale.id)}>
                    Print Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="footer-container" id="footer-container">
        <div className="pagination" id="pagination">
          <ul className="pagination-list" id="pagination-list">
            <li className="pagination-item" id="pagination-item-prev">
              <button
                className="pagination-button" 
                id="pagination-button-prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
            </li>
            {pageNumbers.map(number => (
              <li className="pagination-item" id={`pagination-item-${number}`} key={number}>
                <button
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  id={`pagination-button-${number}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}
            <li className="pagination-item" id="pagination-item-next">
              <button
                className="pagination-button" 
                id="pagination-button-next"
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

export default SaleList;
