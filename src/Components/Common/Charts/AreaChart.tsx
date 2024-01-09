import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface AreaChartProps {
    data: any;
}

const AreaChart: FC<AreaChartProps> = ({ data }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        maintainAspectRatio: false,
        height: 400, // Set the desired height of the chart
        width: 900, // Set the desired width of the chart
    };
    console.log(data?.labels)
    const datas = {
        labels: data?.labels ? data?.labels : ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: data?.datasets[0].label,
                data: data?.datasets[0].data,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
            // Add more datasets if needed
        ],
    };

    return (
        <Line options={options} data={datas} />
    )
}

export default AreaChart;
