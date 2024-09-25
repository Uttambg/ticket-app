import React, { useEffect, useState } from 'react';
import './last7days.css';
import ChartComponentbyday from './ChartComponentsbyday';

interface Message {
    id: string; // Message ID
    text: string; // Content of the message
    timestamp: string; // Timestamp of the message
}

interface Ticket {
    id: string; // Ticket ID
    subject: string;
    priority: string;
    status: string;
    assignedAgent: string | null;
    createdAt: string; // Creation timestamp
    updatedAt: string;
    messages: Message[];
    userId: number;
}

const Last7days: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [solvedCount, setSolvedCount] = useState<number>(0);
    const [closedCount, setClosedCount] = useState<number>(0);
    const [avgResponseTime, setAvgResponseTime] = useState<number>(0);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:8888/api/tickets');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Ticket[] = await response.json();
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const calculateMetrics = (data: Ticket[]) => {
        const filteredData = data.filter(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            return ticketDate >= new Date(new Date().setDate(new Date().getDate() - 7)) &&
                   ticketDate <= new Date();
        });

        const solved = filteredData.filter(ticket => ticket.status === 'solved').length;
        const closed = filteredData.filter(ticket => ticket.status === 'closed').length;

        // Calculate average response time based on the difference between first and last message timestamps
        const responseTimes: number[] = filteredData.map(ticket => {
            if (ticket.messages.length > 1) {
                const firstMessageDate = new Date(ticket.messages[0].timestamp);
                const lastMessageDate = new Date(ticket.messages[ticket.messages.length - 1].timestamp);
                return (lastMessageDate.getTime() - firstMessageDate.getTime()) / 1000; // Convert to seconds
            }
            return 0; // Return 0 if only one message
        });

        const totalResponseTime = responseTimes.reduce((a, b) => a + b, 0);
        const avgTime = responseTimes.length ? totalResponseTime / responseTimes.length : 0;

        setSolvedCount(solved);
        setClosedCount(closed);
        setAvgResponseTime(avgTime);
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
                                        <div className="summary-item">
                                            <p>Avg. response time</p>
                                            <h2>{avgResponseTime.toFixed(2)}s</h2>
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
