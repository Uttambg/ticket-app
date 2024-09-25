import React, { useEffect, useRef } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTicketAlt, FaUsers, FaChartBar, FaBolt, FaCog } from 'react-icons/fa';

interface NavigationBarProps {
  className?: string; // Make className optional
}


const NavigationBar:  React.FC<NavigationBarProps> = ({ className })=> {
  const navigate = useNavigate(); // Move useNavigate inside the component
  const hasNavigated = useRef(false); // Ref to track if navigation has occurred

  useEffect(() => {
    // Navigate to /sidebar when the component mounts and hasn't navigated yet
    if (!hasNavigated.current) {
      navigate('/sidebar');
      hasNavigated.current = true; // Set the flag to true to prevent further navigation
    }
  }, [navigate]);  return (
    <div className={className}>
    <div className="navigationBar">
      <nav>
        <NavLink to="/sidebar" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaTachometerAlt />
        </NavLink>
        <NavLink to="/new-ticket" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaTicketAlt />
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaUsers />
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaChartBar />
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
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
