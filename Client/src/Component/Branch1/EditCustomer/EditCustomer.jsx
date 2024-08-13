import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCustomer.css'; // Optional: Add styles if needed
import {
    FaUser,
    FaPhoneAlt,
    FaMailBulk,
    FaAddressBook,
    FaCalendar,
    FaPersonBooth
} from 'react-icons/fa';

const EditCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/branch1/customers/${id}`);
                if (response.data.Status) {
                    const customer = response.data.Result;
                    setName(customer.name);
                    setPhone(customer.phone);
                    setEmail(customer.email);
                    setAddress(customer.address);
                    setDateOfBirth(customer.date_of_birth || '');
                    setGender(customer.gender || '');
                } else {
                    setMessage(`Error: ${response.data.Error}`);
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
                setMessage('Error fetching customer. Please try again.');
            }
        };
        fetchCustomer();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedCustomer = { 
            name, 
            phone, 
            email, 
            address, 
            date_of_birth: dateOfBirth || null, 
            gender: gender || null 
        };
    
        try {
            const response = await axios.put(`http://localhost:3000/branch1/customers/${id}`, updatedCustomer);
    
            if (response.data.Status) {
                setMessage('Customer updated successfully!');
                setTimeout(() => {
                    navigate('/Component/Branch1/CustomerList/CustomerList'); // Redirect to the customer list page after a delay
                }, 1000); // 2 seconds delay
            } else {
                setMessage(`Error: ${response.data.Error}`);
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            setMessage('Error updating customer. Please try again.');
        }
    };
    
    return (
        <div className='customer-form-overlay'>
            <div className="customer-form-container">
                <h2 className='customer-form-heading'>
                    <FaUser /> Edit Customer
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="customer-form-row">
                        <div className="customer-form-group">
                            <label htmlFor="customer-name-input">
                                <FaUser /> Name
                            </label>
                            <input
                                type="text"
                                id="customer-name-input"
                                className="customer-input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="customer-form-group">
                            <label htmlFor="customer-phone-input">
                                <FaPhoneAlt /> Phone
                            </label>
                            <input
                                type="text"
                                id="customer-phone-input"
                                className="customer-input-field"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="customer-form-row">
                        <div className="customer-form-group">
                            <label htmlFor="customer-email-input">
                                <FaMailBulk /> Email
                            </label>
                            <input
                                type="email"
                                id="customer-email-input"
                                className="customer-input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="customer-form-group">
                            <label htmlFor="customer-address-input">
                                <FaAddressBook /> Address
                            </label>
                            <textarea
                                id="customer-address-input"
                                className="customer-input-textarea"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="customer-form-row">
                        <div className="customer-form-group">
                            <label htmlFor="customer-dob-input">
                                <FaCalendar /> Date of Birth
                            </label>
                            <input
                                type="date"
                                id="customer-dob-input"
                                className="customer-input-field"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <div className="customer-form-group">
                            <label htmlFor="customer-gender-input">
                                <FaPersonBooth /> Gender
                            </label>
                            <select
                                id="customer-gender-input"
                                className="customer-input-field"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="customer-submit-button">
                        Update Customer
                    </button>
                </form>
                {message && <p id="message" className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
            </div>
        </div>
    );
};

export default EditCustomer;
