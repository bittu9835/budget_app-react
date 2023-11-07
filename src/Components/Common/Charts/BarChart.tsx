import type { FC } from 'react';
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




interface BarChartProps {
    data:any
}

const BarChart: FC<BarChartProps> = ({data}) => {
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
    return (
        <Bar options={options} data={data}/>
    );
}

export default BarChart;

