import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SupplierList.css'; // Ensure you have appropriate styles for the supplier list

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [suppliersPerPage] = useState(7);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/branch1/mala/suppliers')
            .then(result => {
                if (result.data) {
                    setSuppliers(result.data);
                } else {
                    alert('Error fetching suppliers');
                }
            })
            .catch(err => console.error('Error fetching suppliers:', err));
    }, []);

    // Function to filter suppliers based on the search query
    const filterSuppliers = (suppliers, query) => {
        const normalizedQuery = query.toLowerCase();
        if (normalizedQuery.trim() === '') return suppliers;

        return suppliers.filter(supplier => 
            supplier.name.toLowerCase().includes(normalizedQuery)
        );
    };

    const filteredSuppliers = filterSuppliers(suppliers, searchQuery);

    // Get current suppliers
    const indexOfLastSupplier = currentPage * suppliersPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
    const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredSuppliers.length / suppliersPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    return (
        <div id='supplierbody'>
            <div className="supplier-container">
                <Link to="/Component/Branch1/AddSupplier/AddSupplier" className="add-supplier-link">Add Supplier</Link>
                
                <div className="heading-search-container">
                    <h3 id="Supplier-heading">Supplier List</h3>
                    
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
                
                <div>
                    <table id="supplier-table">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Supplier Address</th>
                                <th>Supplier Phone Number</th>
                                <th>Email</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSuppliers.map(supplier => (
                                <tr key={supplier.supplier_id}>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.address}</td>
                                    <td>{supplier.phone_number}</td>
                                    <td>{supplier.email}</td>
                                    <td>{new Date(supplier.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-container">
                    <div className="pagination">
                        <ul>
                            <li>
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                            </li>
                            {pageNumbers.map(number => (
                                <li key={number}>
                                    <button
                                        onClick={() => paginate(number)}
                                        className={currentPage === number ? 'active' : ''}
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === pageNumbers.length}
                                >
                                    &gt;
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierList;
