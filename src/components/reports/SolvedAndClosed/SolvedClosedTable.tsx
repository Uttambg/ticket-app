import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Ticket } from '../types';
import './SolvedClosedTable.css';
 
interface SolvedClosedTableProps {
  tickets: Ticket[];
}
 
const SolvedClosedTable: React.FC<SolvedClosedTableProps> = ({ tickets }) => {
  const [showTable, setShowTable] = useState<boolean>(true);
  const dateCounts: { [key: string]: { solved: number; closed: number } } = {};
 
  tickets.forEach(ticket => {
    const date = ticket.createdAt.split('T')[0];
    if (!dateCounts[date]) {
      dateCounts[date] = { solved: 0, closed: 0 };
    }
    if (ticket.status.toLowerCase() === 'solved') {
      dateCounts[date].solved++;
    } else if (ticket.status.toLowerCase() === 'closed') {
      dateCounts[date].closed++;
    }
  });
 
  const labels = Object.keys(dateCounts).sort();
  const solvedData = labels.map(date => dateCounts[date].solved);
  const closedData = labels.map(date => dateCounts[date].closed);
 
  return (
    <div className='table-con'>
      <div style={{ marginTop: '20px' }}>
        <div
          className="toggle-table"
          onClick={() => setShowTable(!showTable)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <FontAwesomeIcon
            icon={showTable ? faChevronDown : faChevronRight}
            style={{ color: '#0066FF', marginRight: '8px' }}
          />
          <span className='break-down-heading'>Solved and Closed Tickets</span>
        </div>
 
        {showTable && (
          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <thead style={{ backgroundColor: '#f8f8f8' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'normal' }}>Status</th>
                  {labels.map(date => (
                    <th key={date} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'normal' }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'normal' }}>Solved</th>
                  {solvedData.map((count, index) => (
                    <td key={labels[index]} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{count}</td>
                  ))}
                </tr>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'normal' }}>Closed</th>
                  {closedData.map((count, index) => (
                    <td key={labels[index]} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{count}</td>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default SolvedClosedTable;
 