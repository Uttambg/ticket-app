// src/NewTickets/NewTickets.tsx

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChartComponentbyDate from './ChartComponentbyDate';
import './newTickets.css';
import NewTicketsTable from './NewTicketsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Ticket as TicketType } from '../types'; // Importing the Ticket interface

const NewTickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketType[]>([]); // Update state type
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filteredData, setFilteredData] = useState<TicketType[]>([]); // Update state type
    const [showTable, setShowTable] = useState(true); // Default to true

    // Set default dates for the last 7 days
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
                const response = await fetch('http://localhost:8888/api/tickets');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: TicketType[] = await response.json(); // Update type here
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets', error);
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        const filterTickets = () => {
            if (startDate && endDate) {
                const filtered = tickets.filter(ticket => {
                    const ticketDate = new Date(ticket.createdAt); // Use createdAt instead of createdDate
                    return ticketDate >= startDate && ticketDate <= endDate;
                });
                setFilteredData(filtered);
            } else {
                setFilteredData(tickets);
            }
        };

        filterTickets();
    }, [tickets, startDate, endDate]);

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
                                            </div>
                                            <div className="chart-container">
                                                <ChartComponentbyDate tickets={filteredData} />
                                                <div
                                                    className="toggle-table"
                                                    onClick={() => setShowTable(!showTable)}
                                                >
                                                    <FontAwesomeIcon icon={showTable ? faChevronDown : faChevronRight} style={{ color: '#0066FF' }} />
                                                    <span className='break-down-heading'> New tickets breakdown</span>
                                                </div>
                                                {showTable && <NewTicketsTable tickets={filteredData} />}
                                           
                                            </div>
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
        
    );
};

export default NewTickets;
