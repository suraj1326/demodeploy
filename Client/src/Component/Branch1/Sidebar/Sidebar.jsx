import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaExchangeAlt, FaMoneyBillWave, FaClipboardList, FaTruck, FaSignOutAlt, FaBarcode } from 'react-icons/fa';
import './Sidebar.css';
import logo from '../../../assets/logo.jpg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div id="sidebar" className="sidebar">
      <div id="sidelogo" className="sidelogo">
        <img src={logo} alt="Your Logo" id="sidebar-logo-img" />
      </div>
      <ul id="sidebar-menu" className="sidebar-menu">
        <li id="sidebar-item-dashboard" className={`sidebar-item ${isActive('/Component/Branch1/Dashboard')}`}>
          <Link to="/Component/Branch1/Dashboard/Dashboard" className="menuLink flex">
            <FaHome />
            <span>Dashboard</span>
          </Link>
        </li>
        <li id="sidebar-item-products" className={`sidebar-item ${isActive('/Component/Branch1/ProductList')}`}>
          <Link to="/Component/Branch1/ProductList/ProductList" className="menuLink flex">
            <FaShoppingCart />
            <span>Products</span>
          </Link>
        </li>
        <li id="sidebar-item-customers" className={`sidebar-item ${isActive('/Component/Branch1/CustomerList')}`}>
          <Link to="/Component/Branch1/CustomerList/CustomerList" className="menuLink flex">
            <FaUser />
            <span>Customers</span>
          </Link>
        </li>
        <li id="sidebar-item-transactions" className={`sidebar-item ${isActive('/Component/Branch1/TransactionList')}`}>
          <Link to="/Component/Branch1/TransactionList/TransactionList" className="menuLink flex">
            <FaExchangeAlt />
            <span>Transactions</span>
          </Link>
        </li>
        <li id="sidebar-item-sales" className={`sidebar-item ${isActive('/Component/Branch1/SaleList')}`}>
          <Link to="/Component/Branch1/SaleList/SaleList" className="menuLink flex">
            <FaMoneyBillWave />
            <span>Sales</span>
          </Link>
        </li>
        <li id="sidebar-item-purchases" className={`sidebar-item ${isActive('/Component/Branch1/PurchaseList')}`}>
          <Link to="/Component/Branch1/PurchaseList/PurchaseList" className="menuLink flex">
            <FaClipboardList />
            <span>Purchases</span>
          </Link>
        </li>
        <li id="sidebar-item-suppliers" className={`sidebar-item ${isActive('/Component/Branch1/SupplierList')}`}>
          <Link to="/Component/Branch1/SupplierList/SupplierList" className="menuLink flex">
            <FaTruck />
            <span>Suppliers</span>
          </Link>
        </li>
        <li id="sidebar-item-barcode" className={`sidebar-item ${isActive('/Component/Branch1/BarcodeScanner')}`}>
          <Link to="/Component/Branch1/BarcodeScanner/BarcodeScanner" className="menuLink flex">
            <FaBarcode />
            <span>Barcode</span>
          </Link>
        </li>
      </ul>
      <div id="logout" className="logout" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
