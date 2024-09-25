
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Updated Ticket interface
interface Message {
  id: string; // Assuming message ID is a string
  text: string; // Example message property
  timestamp: string; // Example timestamp property
}

interface Ticket {
  id: string; // Changed from ticketId to id
  subject: string;
  priority: string;
  status: string; // Changed from ticketStatus to status
  assignedAgent: string | null;
  createdAt: string; // Changed from createdDate to createdAt
  updatedAt: string;
  messages: Message[];
  userId: number;
}

interface ChartComponentProps {
  tickets: Ticket[];
}

const ChartComponentbyday: React.FC<ChartComponentProps> = ({ tickets }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const counts = new Array(7).fill(0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i);

      counts[i] = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt); // Updated to createdAt
        return ticketDate.toDateString() === currentDay.toDateString();
      }).length;
    }

    setChartData({
      labels: days,
      datasets: [
        {
          label: 'Tickets',
          data: counts,
          backgroundColor: 'rgba(0, 102, 255, 0.2)',
          borderColor: '#0066FF',
          borderWidth: 1,
        },
      ],
    });
    setLoading(false);
  }, [tickets]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#0066FF',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: Math.max(...(chartData?.datasets[0]?.data || [0]), 5),
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', maxWidth: '1000px', height: '300px', margin: 'auto' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default ChartComponentbyday;