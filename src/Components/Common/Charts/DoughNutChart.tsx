import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: any
}

const DoughnutChart: FC<DoughnutChartProps> = ({ data }) => {
    const datas = {
        labels: data?.map((e:any)=>e?.category)??[],
        datasets: [
            {
                label: '# of Votes',
                data: data?.map((e:any)=>e?.amount)??[],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Doughnut data={datas} className='w-full h-full' />
    )
}

export default DoughnutChart;