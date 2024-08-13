import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerList.css'; // Ensure you have appropriate styles for the customer list

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(7);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/branch1/customers')
            .then(result => {
                if (result.data.Status) {
                    setCustomers(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching customers:', err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            axios.delete(`http://localhost:3000/branch1/customers/${id}`)
                .then(result => {
                    if (result.data.Status) {
                        setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id));
                    } else {
                        alert(result.data.Error);
                    }
                })
                .catch(err => console.error('Error deleting customer:', err));
        }
    };

    const handleEdit = (id) => {
        navigate(`/Component/Branch1/EditCustomer/EditCustomer/${id}`);
    };

    // Function to filter customers based on the search query
    const filterCustomers = (customers, query) => {
        const normalizedQuery = query.toLowerCase();
        if (normalizedQuery.trim() === '') return customers;

        const queryParts = normalizedQuery.split(' ');

        // Filter by exact matches if query contains spaces
        const filteredCustomers = customers.filter(customer => {
            const customerName = customer.name.toLowerCase();
            if (queryParts.length > 1) {
                // Show customers with names containing all parts
                return queryParts.every(part => customerName.includes(part));
            } else {
                // Show customers with names containing the part
                return customerName.includes(queryParts[0]);
            }
        });

        return filteredCustomers;
    };

    const filteredCustomers = filterCustomers(customers, searchQuery);

    // Get current customers
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCustomers.length / customersPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    return (
        <div className="customer-container">
            <Link to="/Component/Branch1/AddCustomer/AddCustomer" className="add-customer-link">Add Customer</Link>
            
            <h3 id='hd'>Customer List</h3>
            
            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by customer name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            
            <div>
                <table id="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                                <td>{customer.gender}</td>
                                <td>
                                    <button className="action-button edit-button" onClick={() => handleEdit(customer.id)}>Edit</button>
                                    <button className="action-button delete-button" onClick={() => handleDelete(customer.id)}>Delete</button>
                                </td>
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
    );
};

export default CustomerList;
