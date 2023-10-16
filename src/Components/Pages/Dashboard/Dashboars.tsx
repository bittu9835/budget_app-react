import { useEffect, type FC, useState } from 'react';
import { BarChart } from '../../Common/Charts/BarChart';
import { PieChart } from '../../Common/Charts/PiaChart';
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { AreaChart } from '../../Common/Charts/AreaChart';
import Card from '../../Common/Card/Card';
import { motion, useAnimation } from 'framer-motion';
import Table from '../../Common/Table/Table';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {
    const cardControls = useAnimation();

    // Define the animation properties (e.g., scale and opacity)
    const animationVariants = {
        initial: { scale: 0.5, opacity: 0, rotate: -90 }, // Added 'rotate' property
        animate: { scale: 1, opacity: 1, rotate: 0 },   // Added 'rotate' property
    };
    useEffect(() => {
        // Trigger the animation when the component mounts
        cardControls.start('animate');
    }, [cardControls]);
    return (
        <div className='w-full h-full flex gap-2  py-2 px-2 bg-gray-100'>
            <div className='grid grid-cols-1  gap-3 w-full overflow-y-scroll scrollbar-none'>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2  '>
                    <div className="h-36 bg-blue-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <Card
                                title="Current Balance"
                                amount={4345}
                                indicator="1.5%"
                            />
                        </motion.div>
                    </div>
                    <div className="h-36 bg-green-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <Card
                                title="Total Income"
                                amount={343453}
                                indicator="0.4%"
                            />
                        </motion.div>
                    </div>
                    <div className="h-36 bg-red-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <Card
                                title="Total Expence"
                                amount={435346}
                                indicator="2.4%"
                            />
                        </motion.div>
                    </div>
                    <div className="h-36 bg-orange-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <Card
                                title="Income-Expence"
                                amount={45646}
                                indicator="1.5%"
                            />
                        </motion.div>
                    </div>
                </div>
                <div className='w-full shadow-md h-[400px] bg-white rounded-lg p-2 font-sans'>
                    <BarChart />
                </div>
                <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-white rounded-lg p-2 font-sans'>
                    <PieChart />
                </div>
                <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-white rounded-lg p-2 font-sans'>
                    <div className="w-[380px]">
                        <DoughnutChart />
                    </div>
                </div>
                <div className='w-full shadow-md h-[400px] bg-white rounded-lg p-2 font-sans'>
                    <AreaChart />
                </div>
            </div>
            <div className='hidden lg:block w-[30rem] max-w-[30rem] h-full bg-white rounded-md font-sans p-1'>
                <div className='w-full h-full rounded-lg'><Table/></div>
            </div>
        </div>
    );
}

export default Dashboard;
