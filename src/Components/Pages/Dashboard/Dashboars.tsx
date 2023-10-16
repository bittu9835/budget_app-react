import { useEffect, type FC, useState, useContext } from 'react';
import { BarChart } from '../../Common/Charts/BarChart';
import { PieChart } from '../../Common/Charts/PiaChart';
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { AreaChart } from '../../Common/Charts/AreaChart';
import { motion, useAnimation } from 'framer-motion';
import Table from '../../Common/Table/Table';
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { BiRupee } from 'react-icons/bi';
import { FiArrowUpRight } from 'react-icons/fi';

interface DashboardProps { }
interface Transaction {
    _id: string;
    amount: number;
    DrCr: string;
    description: string;
    paymentMethod: string;
    from: string;
    created_at: string;
    created_by: string;
    __v: number;
}

const Dashboard: FC<DashboardProps> = () => {

    const { render } = useContext(DataContext);
    const [trasactions, setTrasactions] = useState<Transaction[]>()
    const [earningAmount, setEarningAmount] = useState<any>()
    const [expenseAmount, setexpenseAmount] = useState<any>()

    const featchTransactions = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getTransaction`,
                method: 'get'
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setTrasactions(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('Error fetching Transactions.');
            }
        }
    }

    useEffect(() => {

        featchTransactions()
        // eslint-disable-next-line 
    }, [render])

    useEffect(() => {
        const sumEarnings = trasactions?.filter((transaction) => transaction.DrCr === "earning")
            .reduce((total, transaction) => total + transaction.amount, 0);
        setEarningAmount(sumEarnings)
        const sumExpenses = trasactions?.filter((transaction) => transaction.DrCr === "expense")
            .reduce((total, transaction) => total + transaction.amount, 0)
        setexpenseAmount(sumExpenses)
        // eslint-disable-next-line 
    }, [trasactions])

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
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  '>

                    <div className="h-36 bg-blue-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <div className='w-full h-full flex flex-col gap-2 bg-transparent rounded-xl p-2'>
                                <p className='cursor-default text-lg font-semibold text-gray-800'>Total Balance</p>
                                <div className='cursor-default flex items-center font-bold gap-1 text-3xl text-gray-900'>
                                    <span><BiRupee /></span>
                                    <span className={`${earningAmount - expenseAmount < 0 ? 'text-red-500' : ''}`}>{earningAmount - expenseAmount}</span>
                                </div>
                                <div className='cursor-default text-green-500 flex items-center gap-2'>
                                    <span className='p-[2px] rounded-full text-white bg-green-500'><FiArrowUpRight /></span>
                                    <span className='text-sm font-bold'>2%</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="h-36 bg-green-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <div className='w-full h-full flex flex-col gap-2 bg-transparent rounded-xl p-2'>
                                <p className='cursor-default text-lg font-semibold text-gray-800'>Income</p>
                                <div className='cursor-default flex items-center font-bold gap-1 text-3xl text-gray-900'>
                                    <span><BiRupee /></span>
                                    <span className='text-green-500'>+{earningAmount}</span>
                                </div>
                                <div className='cursor-default text-green-500 flex items-center gap-2'>
                                    <span className='p-[2px] rounded-full text-white bg-green-500'><FiArrowUpRight /></span>
                                    <span className='text-sm font-bold'>2%</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="h-36 bg-red-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <div className='w-full h-full flex flex-col gap-2 bg-transparent rounded-xl p-2'>
                                <p className='cursor-default text-lg font-semibold text-gray-800'>Expence</p>
                                <div className='cursor-default flex items-center font-bold gap-1 text-3xl text-gray-900'>
                                    <span><BiRupee /></span>
                                    <span className='text-red-500'>-{expenseAmount}</span>
                                </div>
                                <div className='cursor-default text-green-500 flex items-center gap-2'>
                                    <span className='p-[2px] rounded-full text-white bg-green-500'><FiArrowUpRight /></span>
                                    <span className='text-sm font-bold'>2%</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="h-36 bg-orange-200 rounded-md">
                        <motion.div
                            initial="initial"
                            animate={cardControls}
                            variants={animationVariants}
                        >
                            <div className='w-full h-full bg-transparent rounded-md p-2'>
                                <div className='flex w-full h-[84px] border-b-2'>
                                    <div className='w-[50%] h-full border-r-2'>kjnk</div>
                                    <div className='w-[50%] h-full'>oin</div>
                                </div>
                                <div className='w-full h-[60px]'>lin</div>
                            </div>
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
            <div className='hidden lg:block  max-w-[20rem] h-full bg-white rounded-md font-sans p-1'>
                <div className='w-full h-full rounded-lg overflow-auto'><Table /></div>
            </div>
        </div>
    );
}

export default Dashboard;
