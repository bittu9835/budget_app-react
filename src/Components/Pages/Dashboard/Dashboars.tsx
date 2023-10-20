import { useEffect, type FC, useState, useContext } from 'react';
import { BarChart } from '../../Common/Charts/BarChart';
import { PieChart } from '../../Common/Charts/PiaChart';
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { AreaChart } from '../../Common/Charts/AreaChart';
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { BiRupee } from 'react-icons/bi';
import Loader from '../../Common/Loader/Loader';

interface DashboardProps { }
interface Transaction {
    _id: string;
    amount: number;
    action: string;
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
    const [isLoading, setIsLoading] = useState(true)
    const Balance = earningAmount - expenseAmount;
    const featchTransactions = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getTransaction`,
                method: 'get'
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setTrasactions(response?.data?.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500);
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
        const sumEarnings = trasactions?.filter((transaction) => transaction?.action === "income")
            .reduce((total, transaction) => total + transaction.amount, 0);
        setEarningAmount(sumEarnings)
        const sumExpenses = trasactions?.filter((transaction) => transaction?.action === "expence")
            .reduce((total, transaction) => total + transaction.amount, 0)
        setexpenseAmount(sumExpenses)
        // eslint-disable-next-line 
    }, [trasactions])

    useEffect(() => {
        featchTransactions()
        // eslint-disable-next-line 
    }, [render])

    return (
        <div className='w-full h-full flex flex-col gap-2 sm:gap-5 sm:p-5 p-2 overflow-y-scroll scrollbar-none relative'>
            <Loader isLoading={isLoading} />
            <div className='w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5  '>
                <div
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-[#793bcb]'>
                        <span><BiRupee /></span>
                        <span className={`${earningAmount - expenseAmount < 0 ? 'text-red-500' : ''}`}>{Balance?.toLocaleString()}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Total Balance</p>
                </div>
                <div
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-green-500'>
                        <span><BiRupee /></span>
                        <span>{earningAmount?.toLocaleString()}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Income</p>
                </div>
                <div
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-red-500'>
                        <span><BiRupee /></span>
                        <span>{expenseAmount?.toLocaleString()}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Expence</p>
                </div>
                <div
                    className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                    <div className='cursor-default font-sans text-md font-medium sm:text-2xl text-blue-400'>
                        <span>{trasactions?.length}</span>
                    </div>
                    <p className='cursor-default text-sm text-skin-text-dashboard'>Transactions</p>
                </div>
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
