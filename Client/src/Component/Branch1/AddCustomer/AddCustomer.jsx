
import React, { useState } from "react";
import axios from "axios";
import {
  FaMagento,
  FaUser,
  FaPhoneAlt,
  FaMailBulk,
  FaAddressBook,
  FaPersonBooth,
  FaCalendar,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      name,
      phone,
      email,
      address,
      date_of_birth: dateOfBirth,
      gender,
    };
    axios
      .post("http://localhost:3000/branch1/customers", newCustomer)
      .then((result) => {
        if (result.data.Status) {
          navigate("/Component/Branch1/CustomerList/CustomerList");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error adding customer:", err));
  };

  return (
    <div className="customer-form-overlay">
      <div className="customer-form-container">
        <h2 className="customer-form-heading">
          <FaMagento /> Add New Customer
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
                required
              />
            </div>
            <div className="customer-form-group">
              <label htmlFor="customer-gender-input">
                {" "}
                <FaPersonBooth /> Gender
              </label>
              <select
                id="customer-gender-input"
                className="customer-input-field"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit" className="customer-submit-button">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
