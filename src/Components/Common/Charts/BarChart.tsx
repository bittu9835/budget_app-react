import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    maintainAspectRatio: false, // Set this to false to control the height and width manually
    height: 400, // Set the desired height of the chart
    width: 900, // Set the desired width of the chart
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','august'];

// Replace faker data with static data
const dataset1Data = [300, 450, 600, 200, 700, 800, 350];
const dataset2Data = [500, 250, 800, 400, 300, 900, 600];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: dataset1Data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: dataset2Data,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export function BarChart() {
    return <Bar options={options} data={data}/>;
}
