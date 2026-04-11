import { useState, type FC, useContext, ChangeEvent, useEffect } from 'react';
import Table from '../../Common/Table/Table';
import Loader from '../../Common/Loader/Loader';
import { ImSearch } from 'react-icons/im'
import { MdAdd, MdOutlineModeEditOutline } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { DataContext } from '../../../Context/DataProvider';
import { toast } from 'react-toastify';
import emptyImg from '../../../Assets/empty.jpg'
import { useParams } from 'react-router-dom';
import { db } from '../../../db';
import {
  getAllTransactions,
  deleteTransactions as deleteTransactionService,
  TransactionFilters,
  TransactionData
} from '../../../Services/transactionService';
import FilterBar from './Filter';

interface TransactionsProps { }

const Transactions: FC<TransactionsProps> = () => {
  const { setOpenForm, setRender, render, settransactionForEdit, selectedTransaction, setSelectedTransaction } = useContext(DataContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const plasholder = ['Description', 'Category', 'payment Mode']
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [transactionData, setTransactionData] = useState<any>()
  const { filter } = useParams();

  // Filters state — initialize action from URL param if present
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: '',
    action: filter || '',
    category: '',
    paymentMethod: '',
    search: '',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % plasholder.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Update filters when URL param changes
  useEffect(() => {
    if (filter !== undefined) {
      setFilters(prev => ({ ...prev, action: filter }));
    }
  }, [filter]);

  const deleteTransaction = async () => {
    if (selectedTransaction?.length > 0) {
      setIsLoadingButton(true)
      try {
        await deleteTransactionService(selectedTransaction);
        toast.success('Transaction deleted successfully');
        setRender(!render);
        setSelectedTransaction([]);
        setIsLoadingButton(false);
      } catch (error: any) {
        toast.error('Error deleting Transaction.');
        setIsLoadingButton(false);
      }
    }
  }

  const editTransaction = async () => {
    if (selectedTransaction?.length === 1) {
      const transaction = await db.transactions.get(selectedTransaction[0].id);
      if (transaction) {
        settransactionForEdit(transaction)
        setOpenForm(true)
      }
    }
  }

  const fetchTransactions = async () => {
    try {
      const appliedFilters: TransactionFilters = {
        ...filters,
        search: searchValue,
      };
      const data = await getAllTransactions(appliedFilters);
      setTransactionData(data.map((t: TransactionData) => ({ ...t, id: t._id })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [render, searchValue, filters]);

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = [filters.dateRange, filters.action, filters.category, filters.paymentMethod].some(Boolean);

  return (
    <div className="w-full h-full relative bg-gray-50 overflow-auto scrollbar-none px-2">
      <Loader isLoading={isLoading} />
      {transactionData?.length === 0 && !hasActiveFilters && !searchValue ?
        <div className='w-full h-full flex items-center justify-center relative'>
          <img src={emptyImg} className='w-full h-full' alt="" />
          <div className='absolute top-4 text-center'>
            <p className='text-gray-700 font-semibold text-xl'>Transactions Not Found</p>
            <p onClick={() => setOpenForm(true)} className='text-blue-700 cursor-pointer font-medium'>Add Transactions</p>
          </div>
        </div>
        :
        <>
          <div className='sticky top-0 z-10 bg-gray-50 flex flex-col gap-3 mt-3'>
            {/* Search + Add button */}
            <div className='flex gap-5 w-full'>
              <div className='relative shadow-sm w-full text-gray-800'>
                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} title='Search' className='w-full h-8 focus:outline-none text-sm font-semibold placeholder:font-normal pl-10 border rounded-md placeholder:text-sm' placeholder={`search for ${plasholder[placeholderIndex]}`} type="search" />
                <span className='absolute left-3 top-2 text-md'><ImSearch className='text-gray-500' /></span>
              </div>
              <div onClick={() => setOpenForm(true)} title='Add Transaction' className='w-36 hover:shadow-md cursor-pointer bg-skin-bg-button-bg text-skin-button-text text-xs font-bold border flex items-center justify-center rounded-md h-8'>
                <span className='sm:block hidden'>Add Transaction</span>
                <span className='sm:hidden block text-white text-xl'><MdAdd /></span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className='w-full bg-white rounded-lg shadow-sm p-2 border border-gray-100'>
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Action bar (edit/delete) */}
            <div className='w-full bg-white border-b flex justify-between items-center sm:px-5 px-1 rounded-t-lg h-10'>
              <p className='text-lg text-gray-800'>{selectedTransaction.length > 0 ? selectedTransaction?.length : ''}</p>
              <div className='flex gap-1'>
                <div onClick={editTransaction} className={`${selectedTransaction?.length === 1 ? 'hover:bg-gray-300 cursor-pointer text-gray-900' : 'cursor-default text-gray-200'} px-2 py-1 flex items-center gap-2  rounded-sm`}>
                  <MdOutlineModeEditOutline />
                  <span>Edit</span>
                </div>
                {isLoadingButton ?
                  <div className=' cursor-default text-gray-500 bg-gray-300  px-9 py-2 flex items-center justify-center  rounded-sm'>
                    <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                  </div>
                  :
                  <div onClick={deleteTransaction} className={`${selectedTransaction?.length > 0 ? 'hover:bg-gray-300 cursor-pointer text-gray-900' : 'cursor-default text-gray-200'} px-2 py-1 flex items-center gap-2  rounded-sm`}>
                    <RiDeleteBinLine />
                    <span> Delete</span>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* No results message */}
          {transactionData?.length === 0 && (hasActiveFilters || searchValue) && (
            <div className='w-full py-10 flex flex-col items-center justify-center text-gray-500'>
              <p className='text-lg font-medium'>No transactions match your filters</p>
              <button
                onClick={() => {
                  setFilters({ dateRange: '', action: '', category: '', paymentMethod: '', search: '' });
                  setSearchValue('');
                }}
                className='mt-2 text-blue-600 text-sm hover:underline'
              >
                Clear all filters
              </button>
            </div>
          )}

          {transactionData?.length > 0 && (
            <div className='flex'>
              <div className='rounded-b-lg mb-2 w-full'>
                <Table transactionData={transactionData} />
              </div>
            </div>
          )}
        </>}
    </div >
  );
}

export default Transactions;
