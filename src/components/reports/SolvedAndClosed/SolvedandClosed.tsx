import React, { useEffect, useState } from 'react';
import './SolvedandClosed.css';
import SolvedClosedTable from './SolvedClosedTable';
import ChartComponentSolvedandClosed from './ChartComponentSolvedandClosed';
import { Ticket } from '../types'; // Adjust this path to your actual types file
import { useAuth } from '../../authContext'; // Importing the auth context
 
const SolvedAndClosed: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { role, userId } = useAuth(); // Fetch the role and userId from context
 
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let url = '';
 
        // Conditionally set the URL based on the user role
        if (role === 'admin') {
          url = 'http://localhost:8888/api/tickets'; // Admin fetches all tickets
        } else if (userId) {
          url = `http://localhost:8888/api/tickets/user/${userId}`; // User fetches their own tickets
        }
 
        if (url) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: Ticket[] = await response.json();
          setTickets(data);
        }
      } catch (error) {
        console.error('Error fetching tickets', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchTickets();
  }, [role, userId]); // Re-fetch if role or userId changes
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  const totalSolved = tickets.filter(ticket => ticket.status.toLowerCase() === 'solved').length;
  const totalClosed = tickets.filter(ticket => ticket.status.toLowerCase() === 'closed').length;
  const totalTickets = tickets.length;
 
  const solvedPercentage = totalTickets > 0 ? ((totalSolved / totalTickets) * 100).toFixed(1) : '0.0';
  const closedPercentage = totalTickets > 0 ? ((totalClosed / totalTickets) * 100).toFixed(1) : '0.0';
 
  return (
    <div className="last7days-con">
      <div className="main-con">
        <div className="right-con">
          <div className="content-report">
            <div className="last-con">
              <div className="heading">Solved and Closed Tickets</div>
            </div>
          </div>
 
          <div className="inside-con">
            <div className="inside-con-tickets">
              <div className="reports-tickets-con">
                <div className="ticket-report-container">
                  <div className="report-content">
                    <div className="report-header">
                      <div className="report-title">Solved and Closed</div>
                    </div>
 
                    <div style={{ margin: '20px 0' }}>
                      <p><strong>Solved Tickets:</strong> {totalSolved} ({solvedPercentage}%)</p>
                      <p><strong>Closed Tickets:</strong> {totalClosed} ({closedPercentage}%)</p>
                    </div>
                    <div style={{ width: '600px', margin: '50px auto' }}>
                      <ChartComponentSolvedandClosed tickets={tickets} />
                      <SolvedClosedTable tickets={tickets} />
                    </div>
 
                    <div className="report-info-container">
                      <p className='report-info-text'>All reports are displayed in your local time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default SolvedAndClosed;
 
 