import { useEffect, type FC, useState, useContext } from 'react';
import { BarChart } from '../../Common/Charts/BarChart';
import { PieChart } from '../../Common/Charts/PiaChart';
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { AreaChart } from '../../Common/Charts/AreaChart';
import { motion, useAnimation } from 'framer-motion';
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { BiRupee } from 'react-icons/bi';

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
        <div className='w-full h-full flex flex-col gap-2 sm:gap-5 sm:p-5 p-2 overflow-y-scroll scrollbar-none'>
            <div className='w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5  '>

                <motion.div
                    initial="initial"
                    animate={cardControls}
                    variants={animationVariants}
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-[#793bcb]'>
                        <span><BiRupee /></span>
                        <span className={`${earningAmount - expenseAmount < 0 ? 'text-red-500' : ''}`}>{earningAmount - expenseAmount}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Total Balance</p>
                </motion.div>

                <motion.div
                    initial="initial"
                    animate={cardControls}
                    variants={animationVariants}
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-green-500'>
                        <span><BiRupee /></span>
                        <span>{earningAmount}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Income</p>
                </motion.div>

                <motion.div
                    initial="initial"
                    animate={cardControls}
                    variants={animationVariants}
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-red-500'>
                        <span><BiRupee /></span>
                        <span>{expenseAmount}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Expence</p>
                </motion.div>

                <motion.div
                    initial="initial"
                    animate={cardControls}
                    variants={animationVariants}
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default font-sans text-md font-medium sm:text-2xl text-blue-400'>
                        <span>98</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Transactions</p>
                </motion.div>
            </div>
            <div className='w-full bg-skin-bg-dashboard grid grid-cols-1 sm:grid-cols-2 font-sans'>
                <div className='w-full shadow-md h-[400px] p-2'>
                    <BarChart />
                </div>
                <div className='w-full shadow-md h-[400px] flex items-center justify-center'>
                    <PieChart />
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-5 w-full'>
                <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                    <div className="w-[380px]">
                        <DoughnutChart />
                    </div>
                </div>
                <div className='w-full shadow-md h-[400px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                    <AreaChart />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
