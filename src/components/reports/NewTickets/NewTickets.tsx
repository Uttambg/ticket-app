import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChartComponentbyDate from './ChartComponentbyDate';
import NewTicketsTable from './NewTicketsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// Use the auth context to get role and userId
import { Ticket } from '../types';
 
import './newTickets.css';
import { useAuth } from '../../authContext';
 
 
const NewTickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filteredData, setFilteredData] = useState<Ticket[]>([]);
    const [showTable, setShowTable] = useState(true);
    const [selectedPriority, setSelectedPriority] = useState<string>('All');
   
    const { role, userId } = useAuth(); // Fetch the role and userId from context
 
    useEffect(() => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        setStartDate(lastWeek);
        setEndDate(today);
    }, []);
 
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
            }
        };
 
        fetchTickets();
    }, [role, userId]); // Re-fetch if role or userId changes
 
    useEffect(() => {
        const filterTickets = () => {
            if (startDate && endDate) {
                let filtered = tickets.filter(ticket => {
                    const ticketDate = new Date(ticket.createdAt);
                    return ticketDate >= startDate && ticketDate <= endDate;
                });
 
                // Apply priority filter only to filteredData, but don't change allTickets
                if (selectedPriority !== 'All') {
                    filtered = filtered.filter(ticket => ticket.priority === selectedPriority);
                }
 
                setFilteredData(filtered); // Only set filteredData
            } else {
                setFilteredData(tickets);
            }
        };
        filterTickets();
    }, [tickets, startDate, endDate, selectedPriority]); // Include selectedPriority in dependencies
 
    return (
        <div className="last7days-con">
            <div className="main-con">
                <div className="right-con">
                    <div className="content-report">
                        <div className="last-con">
                            <div className="heading">New Tickets</div>
                        </div>
                    </div>
                    <div className="inside-con">
                        <div className="inside-con-tickets">
                            <div className="reports-tickets-con">
                                <div className="ticket-report-container">
                                    <div className="report-content">
                                        <div className="report-header">
                                            <div className="report-title">New Tickets</div>
                                            <div className="report-count">{filteredData.length}</div>
                                            <div className="new-tickets-con">
                                                <div className="filters">
                                                    <div className="date-picker">
                                                        <label className='start-date'>Start Date:</label>
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={date => setStartDate(date)}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="Select Start Date"
                                                        />
                                                    </div>
                                                    <div className="date-picker">
                                                        <label className='start-date'>End Date:</label>
                                                        <DatePicker
                                                            selected={endDate}
                                                            onChange={date => setEndDate(date)}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="Select End Date"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="priority-dropdown">
                                                    <label className='priority-label'>Priority:</label>
                                                    <select onChange={e => setSelectedPriority(e.target.value)} value={selectedPriority}>
                                                        <option value="All">All</option>
                                                        <option value="Urgent">Urgent</option>
                                                        <option value="High">High</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Low">Low</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="chart-container">
                                                <ChartComponentbyDate tickets={filteredData} selectedPriority={selectedPriority} />
                                                <div
                                                    className="toggle-table"
                                                    onClick={() => setShowTable(!showTable)}
                                                >
                                                    <FontAwesomeIcon icon={showTable ? faChevronDown : faChevronRight} style={{ color: '#0066FF' }} />
                                                    <span className='break-down-heading'> New tickets breakdown</span>
                                                </div>
                                                {showTable && <NewTicketsTable tickets={filteredData} allTickets={tickets} />}
                                            </div>
                                        </div>
                                        <div className="report-info-container">
                                            <p className='report-info-text'> All reports are displayed in your local time. </p>
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
 
export default NewTickets;
 