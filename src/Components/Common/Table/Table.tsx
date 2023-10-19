import { useEffect, type FC, useContext, useState } from 'react';
import { BsCashCoin, BsCreditCard2Back } from 'react-icons/bs'
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdAccountBalance } from 'react-icons/md'


interface TableProps { }

const Table: FC<TableProps> = () => {
    const { render } = useContext(DataContext);
    const [transactionData, setTransactionData] = useState<any>()
    const fetchTransactions = async () => {
        try {
            const response: any = await http({
                url: `/transaction/getTransaction`,
                method: 'get'
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setTransactionData(response?.data?.data)
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
        fetchTransactions()
        // eslint-disable-next-line 
    }, [render])
    return (
        <div className="w-full h-full shadow-md rounded-lg overflow-y-auto scrollbar-none">
            <div className='flex justify-between mb-3 px-1'>
                <p className='text-gray-500 font-semibold truncate'>Latest Transactions</p>
                <input className='w-40 h-6 focus:outline-none text-sm text-gray-800 font-semibold px-2 py-1 border rounded-md placeholder:text-sm placeholder:font-semibold' placeholder='search..' type="search" />
            </div>
            <div className='w-full'>
                <div className='w-full h-6 flex items-center justify-around bg-black text-white'>
                    <p>Date</p>
                    <p>Description</p>
                    <p>From</p>
                    <p>Amount</p>
                </div>

                {transactionData?.map((item: any) =>
                    <div key={item?._id} className='grid grid-cols-4 gap-2 w-full border-b hover:bg-gray-500 bg-gray-600 text-white'>
                        <p>{moment(item?.created_at).format('MMM DD, YYYY')}</p>
                        <p className='truncate'>{item?.description}</p>
                        <p className='flex items-center gap-2'>{item?.paymentMethod === 'Cash' ? <BsCashCoin /> : item?.paymentMethod === 'Account' ? <MdAccountBalance /> : item?.paymentMethod === 'Card' ? <BsCreditCard2Back /> : 'NaN'}{item?.from}</p>
                        <p className='w-full flex justify-center'>{item.DrCr === 'earning' ? '+' : item.DrCr === 'expense' ? '-' : ''}{item?.amount}</p>
                    </div>
                )}
            </div>
            {/* <table className="w-full text-sm text-lef relative px-1">
                <thead className="border-l-white bg-skin-fill-table-head px-6 text-skin-base-table-head-text sticky z-20 top-0">
                    <tr className=''>
                        <th scope="col" className="px-6 py-4 font-medium truncate">
                            S.No.
                        </th>
                        <th scope="col" className="sticky left-0 bg-skin-fill-table-head px-4 py-4 font-medium truncate">
                            Discription
                        </th>
                        <th scope="col" className="px-4 py-4 font-medium truncate">
                            Date
                        </th>
                        <th scope="col" className="px-4 py-4 font-medium truncate">
                            Amount
                        </th>
                        <th scope="col" className="px-4 py-4 font-medium truncate">
                            From
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactionData?.map((item: any, index: number) =>
                        <tr key={item._id} className="bg-skin-fill-table hover:text-skin-base-table-hover hover:bg-skin-fill-hover border-l-4 border-transparent text-skin-base-table-body-text hover:border-l-skin-table-color group">
                            <td className="py-[14px] px-6">
                                {index + 1}
                            </td>
                            <td title={item?.description} className="sticky left-0 max-w-[100px] group group-hover:bg-skin-fill-hover bg-skin-fill-table px-4 py-[14px] truncate">
                                {item?.description}
                            </td>
                            <td title={item?.created_at} className="px-4 py-[14px] truncate">
                                {moment(item?.created_at).format('MMM DD, YYYY')}
                            </td>
                            <td title={item?.amount} className={`px-4 py-[14px] font-bold  truncate ${item.DrCr === 'earning' ? 'text-green-500' : item.DrCr === 'expense' ? 'text-red-500' : ''} `}>
                                {item.DrCr === 'earning' ? '+' : item.DrCr === 'expense' ? '-' : ''}{item?.amount}
                            </td>
                            <td title={item?.paymentMethod} className="px-4 py-[14px] flex items-center gap-1 truncate">
                                {item?.paymentMethod === 'Cash' ? <BsCashCoin /> : item?.paymentMethod === 'Account' ? <MdAccountBalance /> : item?.paymentMethod === 'Card' ? <BsCreditCard2Back /> : 'NaN'}{item?.from}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table> */}
        </div>
    );
}

export default Table;
