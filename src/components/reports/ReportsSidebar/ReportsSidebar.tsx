import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Sidebar.css'; 

const ReportSidebar: React.FC = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <div className="main-content">
          <div className="header">
            <div data-testid="page-header" className="page-header">
              <div className="header-text">Reports</div>
            </div>
          </div>
          <div className="content">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/reports/last-7-days"
                  className={({ isActive }) => (isActive ? 'nav-link-item active' : 'nav-link')}
                  end // Use end for exact matching behavior
                >
                  <span className='item'>Last 7 days</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reports/new-tickets"
                  className={({ isActive }) => (isActive ? 'nav-link-item active' : 'nav-link')}
                  end
                >
                  <span>New Tickets</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reports/solved-and-closed"
                  className={({ isActive }) => (isActive ?'nav-link-item active' : 'nav-link')}
                  end
                >
                  <span>Solved and closed</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reports/generate-report"
                  className={({ isActive }) => (isActive ? 'nav-link-item active' : 'nav-link')}
                  end
                >
                  <span>Generate Report</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportSidebar;

