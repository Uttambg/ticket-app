import React from 'react';
import './NewTicketsTable.css';
import { Ticket } from '../types';
 
interface NewTicketsTableProps {
    tickets: Ticket[];    // Current filtered tickets based on date
    allTickets: Ticket[]; // All tickets for displaying total counts
}
 
const NewTicketsTable: React.FC<NewTicketsTableProps> = ({ tickets, allTickets }) => {
    const dateCounts: { [key: string]: number } = {};
    const allDateCounts: { [key: string]: number } = {}; // Count for all tickets
 
    // Count tickets by date from all tickets (not affected by priority changes)
    allTickets.forEach(ticket => {
        const date = new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        allDateCounts[date] = (allDateCounts[date] || 0) + 1;
    });
 
    const dateLabels = Object.keys(allDateCounts).sort(); // Use all tickets date labels
 
    return (
        <div className="nt-table-con">
            {/* Date-wise Ticket Count Table */}
            <div className="nt-table-scroll-date">
                <table className="nt-table">
                    <thead className="nt-thead">
                        <tr>
                            <th className="nt-th">Date</th>
                            {dateLabels.map(date => (
                                <th key={date} className="nt-th">{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="nt-tbody">
                        <tr>
                            <td className="nt-td">New Tickets</td>
                            {dateLabels.map(date => (
                                <td key={date} className="nt-td">{allDateCounts[date] || 0}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
 
            {/* Priority Table */}
            <div className="nt-priority-table-container">
                <table className="nt-table">
                    <thead className="nt-thead">
                        <tr>
                            <th className="nt-th">Priority</th>
                            {['All', 'Urgent', 'High', 'Medium', 'Low'].map(priority => (
                                <th key={priority} className="nt-th">{priority}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="nt-tbody">
                        <tr>
                            <td className="nt-td">Count</td>
                            <td className="nt-td">{allTickets.length}</td> {/* Count for all tickets */}
                            <td className="nt-td">{allTickets.filter(ticket => ticket.priority === 'Urgent').length}</td> {/* Count for urgent priority */}
                            <td className="nt-td">{allTickets.filter(ticket => ticket.priority === 'High').length}</td> {/* Count for high priority */}
                            <td className="nt-td">{allTickets.filter(ticket => ticket.priority === 'Medium').length}</td> {/* Count for medium priority */}
                            <td className="nt-td">{allTickets.filter(ticket => ticket.priority === 'Low').length}</td> {/* Count for low priority */}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
 
export default NewTicketsTable;
 
 