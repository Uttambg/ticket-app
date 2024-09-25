import React, { useEffect } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTicketAlt, FaUsers, FaChartBar, FaBolt, FaCog } from 'react-icons/fa';

interface NavigationBarProps {
  className?: string; // Make className optional
}


const NavigationBar:  React.FC<NavigationBarProps> = ({ className })=> {
  const navigate = useNavigate();
  return (
    <div className={className}>
    <div className="navigationBar">
      <nav>
        <NavLink to="/sidebar" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaTachometerAlt />
        </NavLink>
        <NavLink to="/new-ticket" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaTicketAlt />
        </NavLink>
        <NavLink to="/agents" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaUsers />
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaChartBar />
        </NavLink>
        <NavLink to="/power" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaBolt />
        </NavLink>
        <NavLink to="/logout" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaCog />
        </NavLink>
      </nav>
    </div>
    </div>
  );
};

export default NavigationBar;
