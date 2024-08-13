import React, { useEffect, useState } from 'react';
import './Navbar.css'; // Import the CSS file for the navbar
import defaultProfilePic from '../../../assets/profile.png'; // Adjust path as needed
import whatsappLogo from '../../../assets/whatsapp.jpeg'; // Adjust path as needed

const Navbar = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Fetch email from local storage
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleWhatsAppShare = () => {
        const phoneNumber = '1234567890'; // Replace with the specific phone number
        const message = encodeURIComponent('Hello, this is a message from New Eye Care!');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <div id="navbar">
            <div id="navbar-content">
                <div id="heading-section">
                    <h1 id="navbar-heading">New Eye Care</h1>
                </div>
                <div id="profile-section">
                    <button onClick={handleWhatsAppShare} id="whatsapp-share-button">
                        <img src={whatsappLogo} alt="WhatsApp" id="whatsapp-logo" />
                    </button>
                    {email && <span id="profile-email">{email}</span>}
                    <img src={defaultProfilePic} alt="Profile" id="profile-logo" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
