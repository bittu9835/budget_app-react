import { useState, type FC, useContext, ChangeEvent, useEffect } from 'react';
import Table from '../../Common/Table/Table';
import Loader from '../../Common/Loader/Loader';
import { ImSearch } from 'react-icons/im'
import { MdAdd, MdOutlineModeEditOutline } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';

interface TransactionsProps { }

const Transactions: FC<TransactionsProps> = () => {
  const { setOpenForm, setRender, render, settransactionForEdit,selectedTransaction, setSelectedTransaction } = useContext(DataContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const plasholder =['Description','Category','payment Mode']
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % plasholder.length);
    }, 3000);
    return () => clearInterval(interval); 
     // eslint-disable-next-line 
  }, []);


  const deleteTransaction = async () => {
    if (selectedTransaction?.length > 0) {
      setIsLoadingButton(true)
      try {
        const response: any = await http({
          url: `/transaction/deleteTransaction`,
          method: 'delete',
          data: selectedTransaction
        });
        if (response?.data?.code === 'SUCCESS_200') {
          setRender(!render)
          setSelectedTransaction([])
          toast.success(response?.data?.message);
          setIsLoadingButton(false)
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error: any) {
        setIsLoadingButton(false)
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('Error fetching Transactions.');
        }
      }
    }

  }

  const editTransaction = async () => {
    if (selectedTransaction?.length === 1) {
      try {
        const response: any = await http({
          url: `/transaction/getTransactionsForEdit`,
          method: 'get',
          data: selectedTransaction[0]
        });
        if (response?.data?.code === 'SUCCESS_200') {
          settransactionForEdit(response?.data?.data)
          setOpenForm(true)
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
  }



  return (
    <div className="w-full h-full relative bg-gray-50 overflow-auto scrollbar-none px-2">
      <Loader isLoading={isLoading} />
      <div className='sticky top-0 z-10 bg-gray-50 flex flex-col gap-5 mt-3 px-1'>
        <div className='flex gap-5  w-full'>
          <div className='relative shadow-sm w-full text-gray-800'>
            <input onChange={(e:ChangeEvent<HTMLInputElement>)=>setSearchValue(e.target.value)} title='Search' className='w-full h-8 focus:outline-none text-sm font-semibold placeholder:font-normal pl-10 border rounded-md placeholder:text-sm' placeholder={`search for ${plasholder[placeholderIndex]}`} type="search" />
            <span className='absolute left-3 top-2 text-md'><ImSearch className='text-gray-500' /></span>
          </div>
          <div onClick={() => setOpenForm(true)} title='Add Transaction' className='w-36 hover:shadow-md cursor-pointer bg-skin-bg-button-bg text-skin-button-text text-xs font-bold border flex items-center justify-center rounded-md h-8'>
            <span className='sm:block hidden'>Add Transaction</span>
            <span className='sm:hidden block text-white text-xl'><MdAdd /></span>
          </div>
        </div>
        <div className='w-full bg-white border-b flex justify-between items-center sm:px-5 px-1 rounded-sm h-10'>
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
      <div>
        <Table searchValue={searchValue} setIsLoading={setIsLoading} setSelectedTransaction={setSelectedTransaction} selectedTransaction={selectedTransaction} />
      </div>
    </div>
  );
}

export default Transactions;
