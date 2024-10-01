import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Ticket } from '../types';
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
    tickets: Ticket[];
    selectedPriority: string;
}
 
const ChartComponentbyDate: React.FC<ChartComponentProps> = ({ tickets, selectedPriority }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
 
    useEffect(() => {
        setLoading(true);
        const counts: { [key: string]: number } = {};
 
        const filteredTickets = selectedPriority === 'All'
            ? tickets
            : tickets.filter(ticket => ticket.priority === selectedPriority);
 
        filteredTickets.forEach(ticket => {
            const date = new Date(ticket.createdAt);
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            counts[dateString] = (counts[dateString] || 0) + 1;
        });
 
        const sortedLabels = Object.keys(counts).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
        });
 
        const sortedData = sortedLabels.map(label => counts[label]);
 
        setChartData({
            labels: sortedLabels,
            datasets: [
                {
                    label: `Tickets (${selectedPriority})`,
                    data: sortedData,
                    backgroundColor: 'rgba(0, 102, 255, 0.2)',
                    borderColor: '#0066FF',
                    borderWidth: 1,
                },
            ],
        });
        setLoading(false);
    }, [tickets, selectedPriority]);
 
    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                grid: { display: false },
                ticks: { autoSkip: false },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                ticks: { stepSize: 1 },
            },
        },
    };
 
    return (
        <div className="chart-container">
            {loading ? <p>Loading...</p> : <Bar data={chartData} options={options} />}
        </div>
    );
};
 
export default ChartComponentbyDate;
 
 
 