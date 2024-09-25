import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar'; // Named import
import AppRoutes from './Routes'; // Import the routes component
import NewTicket from './components/NewTicket';
import Login from './components/Login';
import ProtectedRoute from './components/protectRoute';
import NavigationBar from './components/NavBar';
import './App.css'; // Assuming you'll add styles here
import LogoutPage from './components/Logout';
import ReportSidebar from './components/reports/ReportsSidebar/ReportsSidebar';
import Last7days from './components/reports/Last7Days/Last7days';
import NewTickets from './components/reports/NewTickets/NewTickets';
import SolvedAndClosed from './components/reports/SolvedAndClosed/SolvedandClosed';
import GenerateReport from './components/reports/GenerateReport/GenerateReport';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="app-layout">
      {/* Protect the NavigationBar */}
      {!isLoginPage && <ProtectedRoute element={<NavigationBar className="NavigationBar" />} />}

      <div className="content-area">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<AppRoutes />} />} />
          <Route path="/sidebar" element={<ProtectedRoute element={<Sidebar />} />} />
          <Route path="/new-ticket" element={<ProtectedRoute element={<NewTicket />} />} />
          <Route path="/logout" element={<ProtectedRoute element={<LogoutPage />} />} />

          {/* Nest the routes for the reports */}
          <Route
            path="/reports/*"
            element={
              <div className="report-layout">
                <ReportSidebar />
                <Routes>
                  <Route path="last-7-days" element={<Last7days />} />
                  <Route path="new-tickets" element={<NewTickets />} />
                  <Route path="solved-and-closed" element={<SolvedAndClosed />} />
                  <Route path="generate-report" element={<GenerateReport />} />
                  <Route path="*" element={<Last7days />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
