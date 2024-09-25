import React from 'react';
import './NewTicketsTable.css';
import { Ticket } from '../types'; // Adjust the path based on your folder structure

interface NewTicketsTableProps {
    tickets: Ticket[]; // Use the imported Ticket type
}

const NewTicketsTable: React.FC<NewTicketsTableProps> = ({ tickets }) => {
    const dateCounts: { [key: string]: number } = {};

    tickets.forEach(ticket => {
        const date = new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const labels = Object.keys(dateCounts).sort();

    return (
        <div className="table-con">
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Series</th>
                            {labels.map(date => (
                                <th key={date}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>New Tickets</td>
                            {labels.map(date => (
                                <td key={date}>{dateCounts[date] || 0}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewTicketsTable;
