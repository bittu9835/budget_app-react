import type { FC } from 'react';
import { BarChart } from '../../Common/Charts/BarChart';
import { PieChart } from '../../Common/Charts/PiaChart';
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { AreaChart } from '../../Common/Charts/AreaChart';

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
    return (
        <div className='w-full h-full overflow-y-scroll scrollbar-thin py-2 lg:py-0'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
                    <div className='w-full shadow-md h-[400px] bg-white rounded-lg p-2 font-sans'>
                        <BarChart/>
                    </div>
                    <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-white rounded-lg p-2 font-sans'>
                        <PieChart/>
                    </div>
                    <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-white rounded-lg p-2 font-sans'>
                        <div className="w-[380px]">
                        <DoughnutChart/>
                        </div>
                    </div>
                    <div className='w-full shadow-md h-[400px] bg-white rounded-lg p-2 font-sans'>
                        <AreaChart/>
                    </div>
                </div>
            </div>
    );
}

export default Dashboard;
