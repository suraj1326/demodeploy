import React from 'react';
import Sidebar from "../Sidebar/Sidebar";
import Navbar from '../Navbar/Navbar';

import './Layout1.css'; 

const Layout1 = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar /> 

      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout1;
