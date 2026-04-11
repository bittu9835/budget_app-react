import { useEffect, type FC, useState, useContext } from 'react';
import BarChart from '../../Common/Charts/BarChart';
import { DataContext } from '../../../Context/DataProvider';
import { BiRupee } from 'react-icons/bi';
import Loader from '../../Common/Loader/Loader';
import emptyImg from '../../../Assets/empty.jpg'
import PieChart from '../../Common/Charts/PiaChart';
import DoughnutChart from '../../Common/Charts/DoughNutChart';
import AreaChart from '../../Common/Charts/AreaChart';
import { useNavigate } from 'react-router-dom';
import {
    getAllTransactions,
    computeDashboardStats,
    TransactionFilters,
    DashboardStats,
    TransactionData
} from '../../../Services/transactionService';
import FilterBar from '../Transactions/Filter';

interface DashboardProps { }

const Dashboard: FC<DashboardProps> = () => {

    const { render, setOpenForm } = useContext(DataContext);
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<TransactionFilters>({
        dateRange: '',
        action: '',
        category: '',
        paymentMethod: '',
    });
    const navigate = useNavigate();

    // Fetch transactions from IndexedDB with filters
    const fetchData = async () => {
        try {
            const data = await getAllTransactions(filters);
            setTransactions(data);
            const computed = computeDashboardStats(data);
            setStats(computed);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [render, filters]);

    const handleFilterChange = (newFilters: TransactionFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className='w-full h-full flex flex-col gap-2 sm:gap-5 sm:p-5 p-2 overflow-y-scroll scrollbar-none relative'>
            <Loader isLoading={isLoading} />
            {transactions?.length === 0 && !isLoading && Object.values(filters).every(v => !v) ?
                <div className='w-full h-full flex items-center justify-center relative'>
                    <img src={emptyImg} className='w-full h-full' alt="" />
                    <div className='absolute top-4 text-center'>
                        <p className='text-gray-700 font-semibold text-xl'>Transactions Not Found</p>
                        <p onClick={() => setOpenForm(true)} className='text-blue-700 cursor-pointer font-medium'>Add Transactions</p>
                    </div>
                </div>
                :
                <>
                    {/* Filter Bar */}
                    <div className='w-full bg-white rounded-lg shadow-sm p-3 border border-gray-100'>
                        <FilterBar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            compact={true}
                        />
                    </div>

                    {/* No results after filtering */}
                    {transactions.length === 0 && !isLoading && (
                        <div className='w-full py-10 flex flex-col items-center justify-center text-gray-500'>
                            <p className='text-lg font-medium'>No transactions match your filters</p>
                            <button
                                onClick={() => setFilters({ dateRange: '', action: '', category: '', paymentMethod: '' })}
                                className='mt-2 text-blue-600 text-sm hover:underline'
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Summary Cards */}
                    {stats && transactions.length > 0 && (
                        <>
                            <div className='w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                                <div className='w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                                    <div className={`${stats.totalBalance < 0 ? 'text-red-500' : 'text-[#793bcb]'} cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl`}>
                                        <span><BiRupee /></span>
                                        <span>{stats.totalBalance?.toLocaleString()}</span>
                                    </div>
                                    <p className='cursor-default text-sm text-skin-text-dashboard'>Total Balance</p>
                                </div>
                                <div onClick={() => navigate('/home/transactions/income')}
                                    className='cursor-pointer w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-green-500'>
                                        <span><BiRupee /></span>
                                        <span>{stats.totalIncome?.toLocaleString()}</span>
                                    </div>
                                    <p className='cursor-default text-sm text-skin-text-dashboard'>Income</p>
                                </div>
                                <div onClick={() => navigate('/home/transactions/expence')}
                                    className='cursor-pointer w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                                    <div className='cursor-default flex items-center font-sans gap-1 text-md font-medium sm:text-2xl text-red-500'>
                                        <span><BiRupee /></span>
                                        <span>{stats.totalExpense?.toLocaleString()}</span>
                                    </div>
                                    <p className='cursor-default text-sm text-skin-text-dashboard'>Expence</p>
                                </div>
                                <div onClick={() => navigate('/home/transactions')}
                                    className='cursor-pointer w-full h-24 bg-skin-bg-dashboard flex flex-col items-center justify-center gap-2 shadow-md rounded-md'>
                                    <div className='cursor-default font-sans text-md font-medium sm:text-2xl text-blue-400'>
                                        <span>{stats.transactionCount}</span>
                                    </div>
                                    <p className='cursor-default text-sm text-skin-text-dashboard'>Transactions</p>
                                </div>
                            </div>

                            {/* Charts Row 1: Bar + Line */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5 w-full'>
                                {stats.barGraphData &&
                                    <div className='w-full shadow-md h-[450px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                                        <h1 className='w-full self-start text-sm border-b pb-2'>Monthly Income & Expense</h1>
                                        <div className="w-full h-[400px] flex items-center justify-center">
                                            <BarChart data={stats.barGraphData} />
                                        </div>
                                    </div>
                                }
                                {stats.lineGraphData &&
                                    <div className='w-full shadow-md h-[450px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                                        <h1 className='w-full self-start text-sm border-b pb-2'>Total Balance</h1>
                                        <div className="w-full h-[400px] flex items-center justify-center">
                                            <AreaChart data={stats.lineGraphData} />
                                        </div>
                                    </div>
                                }
                            </div>

                            {/* Charts Row 2: Doughnut + Pie */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5 w-full'>
                                <div className='w-full shadow-md h-[450px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                                    <h1 className='w-full self-start text-sm border-b pb-2'>Income Category</h1>
                                    <div className="w-full h-[400px] flex items-center justify-center">
                                        <DoughnutChart data={stats.incomeByCategory} />
                                    </div>
                                </div>
                                <div className='w-full shadow-md h-[450px] bg-skin-bg-dashboard rounded-lg p-2 font-sans'>
                                    <h1 className='w-full self-start text-sm border-b pb-2'>Expense Category</h1>
                                    <div className="w-full h-[400px] flex items-center justify-center">
                                        <PieChart data={stats.expenseByCategory} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            }
        </div>
    );
}

export default Dashboard;
