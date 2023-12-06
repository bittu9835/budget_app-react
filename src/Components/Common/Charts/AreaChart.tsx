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
    data.datasets[0]['borderColor'] = 'rgb(53, 162, 235)'
    data.datasets[0]['fill'] = true
    return (
        <Line options={options} data={data} />
    );
}

export default AreaChart;
