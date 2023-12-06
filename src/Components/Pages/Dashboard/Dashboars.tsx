import { useEffect, type FC, useState, useContext } from 'react';
import BarChart from '../../Common/Charts/BarChart'; 
import { DoughnutChart } from '../../Common/Charts/DoughNutChart';
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { BiRupee } from 'react-icons/bi';
import Loader from '../../Common/Loader/Loader';
import emptyImg from '../../../Assets/empty.jpg'
import PieChart from '../../Common/Charts/PiaChart';
import AreaChart from '../../Common/Charts/AreaChart';

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

    const { render, setOpenForm } = useContext(DataContext);
    const [trasactions, setTrasactions] = useState<Transaction[]>()
    const [barGraphData, setBarGraphData] = useState<any>()
    const [lineGraphData, setLineGraphData] = useState<any>()
    const [piGraphData, setpiGraphData] = useState<any>()
    const [earningAmount, setEarningAmount] = useState<any>()
    const [expenseAmount, setexpenseAmount] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const Balance = earningAmount - expenseAmount;

    const featchTransactions = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getTransactionsForDashboard`,
                method: 'get',
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
    const featchBarGraphData = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getBarGraphData`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setBarGraphData(response?.data?.data)
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
    const featchLineGraphData = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getLineGraphData`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setLineGraphData(response?.data?.data)
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
    const featchPiGraphData = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getPieGraphData`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setpiGraphData(response?.data?.data)
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
        featchBarGraphData()
        featchLineGraphData()
        featchPiGraphData()
        // eslint-disable-next-line 
    }, [render]);

    return (
        <div className='w-full h-full flex flex-col gap-2 sm:gap-5 sm:p-5 p-2 overflow-y-scroll scrollbar-none relative'>
            <Loader isLoading={isLoading} />
            {trasactions?.length === 0 ?
                <div className='w-full h-full flex items-center justify-center relative'>
                    <img src={emptyImg} className='w-full h-full' alt="" />
                    <div className='absolute top-4 text-center'>
                        <p className='text-gray-700 font-semibold text-xl'>Transactions Not Found</p>
                        <p onClick={() => setOpenForm(true)} className='text-blue-700 cursor-pointer font-medium'>Add Transactions</p>
                    </div>
                </div>
                :
                <>
                    <div className='w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5  '>
                        <div
                            className=' w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                            <div className={`${earningAmount - expenseAmount < 0 ? 'text-red-500' : 'text-[#793bcb]'} cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl `}>
                                <span><BiRupee /></span>
                                <span className={``}>{Balance?.toLocaleString()}</span>
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
                    <div className='w-full rounded-md bg-skin-bg-dashboard grid grid-cols-1 sm:grid-cols-2 font-sans'>
                        {barGraphData &&
                            <div className='w-full shadow-md h-[400px] p-2'>
                                <BarChart data={barGraphData}/>
                            </div>}
                        <div className='w-full shadow-md h-[400px] pb-3 flex items-center justify-center text-xs'>
                            <PieChart data={piGraphData}/>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-5 w-full'>
                        <div className='w-full shadow-md h-[400px] flex items-center justify-center bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                            <div className="w-[380px]">
                                <DoughnutChart />
                            </div>
                        </div>
                        <div className='w-full shadow-md h-[400px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                            {lineGraphData && <AreaChart data={lineGraphData}/>}
                        </div>
                    </div>
                </>}
        </div>
    );
}

export default Dashboard;
