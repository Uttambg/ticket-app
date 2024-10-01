import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTicketAlt, FaClipboardList, FaUsers, FaChartBar, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa'; // Changed to use FaSignOutAlt
import useTickets from '../api/useTickets';
 
interface NavigationBarProps {
  className?: string;
}
 
const NavigationBar: React.FC<NavigationBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);
  const { userRole} =
  useTickets();
 
  useEffect(() => {
    if (!hasNavigated.current) {
      navigate("/sidebar");
      hasNavigated.current = true;
    }
  }, [navigate]);
 
  return (
 
 
    <div className={className}>
     {
      userRole == 'agent' ?  <div
      className="navigationBar"
      style={{
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '-15px',
      }}
    >
      <nav style={{ display: 'flex', gap: '0.35rem' }}> {}
        {[
          { to: '/sidebar', icon: <FaTicketAlt /> },
   
          { to: '/logout', icon: <FaSignOutAlt /> },
        ].map(({ to, icon }) => (
          <NavLink
            to={to}
            key={to}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#ffffff' : '#f0f0f0',
              transition: 'color 0.3s, transform 0.2s',
              display: 'flex',
              alignItems: 'center',
            })}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
             
              e.currentTarget.style.color = e.currentTarget.className.includes('active') ? '#ffffff' : '#f0f0f0';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {React.cloneElement(icon, { style: { marginTop: '35px' } })} {}
          </NavLink>
        ))}
      </nav>
    </div> :  <div
      className="navigationBar"
      style={{
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '-15px',
      }}
    >
      <nav style={{ display: 'flex', gap: '0.35rem' }}> {}
        {[
          { to: '/sidebar', icon: <FaTicketAlt /> },
         { to: '/agents', icon: <FaUsers /> },
         { to: '/reports', icon: <FaChartBar /> },
         { to: '/delete', icon: <FaTrashAlt /> },
          { to: '/logout', icon: <FaSignOutAlt /> },
        ].map(({ to, icon }) => (
          <NavLink
            to={to}
            key={to}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#ffffff' : '#f0f0f0',
              transition: 'color 0.3s, transform 0.2s',
              display: 'flex',
              alignItems: 'center',
            })}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
             
              e.currentTarget.style.color = e.currentTarget.className.includes('active') ? '#ffffff' : '#f0f0f0';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {React.cloneElement(icon, { style: { marginTop: '35px' } })} {}
          </NavLink>
        ))}
      </nav>
    </div>
     }
    </div>
  );
};
 
export default NavigationBar;
 
 
 
 
 
 
 