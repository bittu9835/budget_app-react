import type { FC } from 'react';
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
    data: any
}

const AreaChart: FC<AreaChartProps> = ({ data }) => {
    const options = {
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };
    console.log(data)
    const labels = data?.labels;

    // Replace the dynamic data with static data
    const staticData = [300, 450, 600, 200, 700, 800, 350];

    const datas = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Dataset 2',
                data: staticData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <Line options={options} data={datas} />
    );
}

export default AreaChart;
