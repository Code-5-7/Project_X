import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SummaryChart({ userId, refreshTrigger }) {
    const [summary, setSummary] = useState({ income: 0, expenses: 0 });

    useEffect(() => {
        fetch(`http://localhost:5000/api/summary/${userId}`)
            .then(res => res.json())
            .then(data => setSummary({
                income: parseFloat(data.income) || 0,
                expenses: Math.abs(parseFloat(data.expenses)) || 0
            }))
            .catch(err => console.error(err));
    }, [userId, refreshTrigger]);

    const data = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Financial Summary',
                data: [summary.income, summary.expenses],
                backgroundColor: ['#34D399', '#F87171'],
                borderColor: ['#059669', '#B91C1C'],
                borderWidth: 1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb'
                }
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#e5e7eb',
                bodyColor: '#e5e7eb'
            }
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Financial Summary</h2>
            <Bar data={data} options={options} />
        </div>
    );
}

export default SummaryChart;