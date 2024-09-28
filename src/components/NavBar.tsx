import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTicketAlt, FaClipboardList, FaUsers, FaChartBar, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa'; // Changed to use FaSignOutAlt
 
interface NavigationBarProps {
  className?: string; // Make className optional
}
 
const NavigationBar: React.FC<NavigationBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const hasNavigated = useRef(false); // Ref to track if navigation has occurred
 
  // Only run this effect once when the component is mounted
  useEffect(() => {
    if (!hasNavigated.current) {
      navigate("/sidebar"); // Navigate to /sidebar only on the first render
      hasNavigated.current = true; // Set to true to prevent future navigations
    }
  }, [navigate]);
 
  return (
 
 
    <div className={className}>
      <div
        className="navigationBar"
        style={{
          backgroundColor: '#1a1a2e', // Dark blue background
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '-15px', // Adjust this value to pull the bar up
        }}
      >
        <nav style={{ display: 'flex', gap: '0.35rem' }}> {/* Space between icons */}
          {[
            { to: '/sidebar', icon: <FaTicketAlt /> }, // Updated icon for all recent tickets
            { to: '/agents', icon: <FaUsers /> },
            { to: '/reports', icon: <FaChartBar /> },
            { to: '/delete', icon: <FaTrashAlt /> }, // Dustbin symbol
            { to: '/logout', icon: <FaSignOutAlt /> }, // Changed to logout symbol
          ].map(({ to, icon }) => (
            <NavLink
              to={to}
              key={to}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#f0f0f0', // White when active, light gray otherwise
                transition: 'color 0.3s, transform 0.2s',
                display: 'flex',
                alignItems: 'center',
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'; // White on hover
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                // Reset color based on isActive state
                e.currentTarget.style.color = e.currentTarget.className.includes('active') ? '#ffffff' : '#f0f0f0';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {React.cloneElement(icon, { style: { marginTop: '35px' } })} {/* Adjust the icon position */}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
 
export default NavigationBar;
 
 