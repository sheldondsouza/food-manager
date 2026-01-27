import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { MdDashboard, MdTableRestaurant, MdFastfood, MdReceiptLong } from 'react-icons/md';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <NavLink to="/" activeclassname="active">
          <MdDashboard />
        </NavLink>
        <NavLink to="/Tables" activeclassname="active">
          <MdTableRestaurant />
        </NavLink>
        <NavLink to="/Orders" activeclassname="active">
          <MdReceiptLong />
        </NavLink>
        <NavLink to="/customer/Menu" activeclassname="active">
          <MdFastfood />
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
