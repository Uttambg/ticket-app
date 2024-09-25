// src/NewTickets/ChartComponentbyDate.tsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Ticket } from '../types'; // Import the Ticket interface
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

interface ChartComponentProps {
    tickets: Ticket[]; // Use the imported Ticket type
}

const ChartComponentbyDate: React.FC<ChartComponentProps> = ({ tickets }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const counts: { [key: string]: number } = {};
        const labels: string[] = [];

        tickets.forEach(ticket => {
            const date = new Date(ticket.createdAt); // Use createdAt for date
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            counts[dateString] = (counts[dateString] || 0) + 1;
        });

        // Sort labels in ascending order based on date
        const sortedLabels = Object.keys(counts).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime(); // Ascending order
        });

        const sortedData = sortedLabels.map(label => counts[label]);

        setChartData({
            labels: sortedLabels,
            datasets: [
                {
                    label: 'Tickets',
                    data: sortedData,
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
        plugins: {
            legend: {
                position: 'top',
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
        <div className="chart-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default ChartComponentbyDate;
