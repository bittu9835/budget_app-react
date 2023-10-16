import { useEffect, type FC, useContext, useState } from 'react';
import { BsCalendar, BsCash, BsCashCoin } from 'react-icons/bs'
import { DataContext } from '../../../Context/DataProvider';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import moment from 'moment';


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
            <table className="w-full text-sm text-left text-gray-500 relative px-1">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 ">
                    <tr>
                        <th scope="col" className="px-1 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-1 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-1 py-3">
                            Amount
                        </th>
                        <th scope="col" className="px-1 py-3">
                            From
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactionData?.map((item: any) =>
                        <tr key={item._id} className="bg-white border-b cursor-default">
                            <th title={item?.description} className="max-w-[100px] px-1 py-4 truncate">
                                {item?.description}
                            </th>
                            <td title={item?.created_at} className="px-1 py-4">
                                {moment(item?.created_at).format('MMM DD, YYYY')}
                            </td>
                            <td title={item?.amount} className={`px-1 font-bold py-4 ${item.DrCr === 'earning' ? 'text-green-500' : item.DrCr === 'expense' ? 'text-red-500' : ''} `}>
                                {item.DrCr === 'earning' ? '+' : item.DrCr === 'expense' ? '-' : ''}{item?.amount}
                            </td>
                            <td title={item?.paymentMethod} className="px-3 py-4 flex items-center gap-1">
                                {item?.paymentMethod === 'Cash' ? <BsCashCoin /> : item?.paymentMethod === 'Account' ? <BsCash/> : item?.paymentMethod === 'Card' ? <BsCalendar/> : 'NaN'}{item?.from}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
