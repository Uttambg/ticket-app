import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface Message {
  id: string; 
  text: string; 
  timestamp: string; 
}

interface ChartComponentProps {
  tickets: Ticket[];
}

const ChartComponentSolvedandClosed: React.FC<ChartComponentProps> = ({ tickets }) => {
  const dateCounts: { [key: string]: { solved: number; closed: number } } = {};

  tickets.forEach(ticket => {
    if (!dateCounts[ticket.createdAt]) {
      dateCounts[ticket.createdAt] = { solved: 0, closed: 0 };
    }
    if (ticket.status === 'solved') {
      dateCounts[ticket.createdAt].solved++;
    } else if (ticket.status === 'closed') {
      dateCounts[ticket.createdAt].closed++;
    }
  });

  const labels = Object.keys(dateCounts).sort().map(date => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const solvedData = labels.map((_, index) => {
    const originalDate = Object.keys(dateCounts).sort()[index]; 
    return dateCounts[originalDate]?.solved || 0; 
  });

  const closedData = labels.map((_, index) => {
    const originalDate = Object.keys(dateCounts).sort()[index]; 
    return dateCounts[originalDate]?.closed || 0; 
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Solved',
        data: solvedData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        maxBarThickness: 40, 
      },
      {
        label: 'Closed',
        data: closedData,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Solved and Closed Tickets',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        stacked: false,
        grid: {
          display: true, 
          color: 'rgba(0, 0, 0, 0.1)', 
          lineWidth: 1, 
        },
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponentSolvedandClosed;
