import React, { useEffect, useState } from 'react';
import './last7days.css';
import ChartComponentbyday from './ChartComponentsbyday';
import { useAuth } from '../../authContext'; // Use the auth context
 
interface Message {
    id: string;
    text: string;
    timestamp: string;
}
 
interface Ticket {
    id: string;
    subject: string;
    priority: string;
    status: string;
    assignedAgent: string | null;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
    userId: number;
}
 
const Last7days: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [solvedCount, setSolvedCount] = useState<number>(0);
    const [closedCount, setClosedCount] = useState<number>(0);
 
    const { role, userId } = useAuth(); // Fetch role and userId from auth context
 
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                let url = '';
                // Conditionally set the URL based on the user role
                if (role === 'admin') {
                    url = 'http://localhost:8888/api/tickets'; // Admin fetches all tickets
                } else if (userId) {
                    url = `http://localhost:8888/api/tickets/user/${userId}`; // Users fetch their own tickets
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
 
    const calculateMetrics = (data: Ticket[]) => {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
 
        const filteredData = data.filter(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            return ticketDate >= weekAgo && ticketDate <= now;
        });
 
        const solved = filteredData.filter(ticket => ticket.status === 'Solved').length;
        const closed = filteredData.filter(ticket => ticket.status === 'Closed').length;
 
        setSolvedCount(solved);
        setClosedCount(closed);
    };
 
    useEffect(() => {
        if (tickets.length > 0) {
            calculateMetrics(tickets);
        }
    }, [tickets]);
 
    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }
 
    return (
        <div className="last7days-con">
            <div className="main-con">
                <div className="right-con">
                    <div className="content-report">
                        <div className="last-con">
                            <div className="heading">Last 7 days</div>
                        </div>
                    </div>
 
                    <div className="inside-con">
                        <div className="inside-con-tickets">
                            <div className="reports-tickets-con">
                                <div className="ticket-report-container">
                                    <div className="report-content">
                                        <div className="report-header">
                                            <div className="report-title">New Tickets</div>
                                            <div className="report-count">{tickets.filter(ticket => {
                                                const ticketDate = new Date(ticket.createdAt);
                                                return ticketDate >= new Date(new Date().setDate(new Date().getDate() - 7)) &&
                                                    ticketDate <= new Date();
                                            }).length}</div>
                                            <div className="report-subtitle">from previous 7 days</div>
                                        </div>
                                        <div className="chart-container">
                                            <ChartComponentbyday tickets={tickets} />
                                        </div>
                                    </div>
                                    <div className="summary-container">
                                        <div className="summary-item">
                                            <p>Solved tickets</p>
                                            <h2>{solvedCount}</h2>
                                        </div>
                                        <div className="summary-item">
                                            <p>Closed tickets</p>
                                            <h2>{closedCount}</h2>
                                        </div>
                                    </div>
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
    );
};
 
export default Last7days;
 