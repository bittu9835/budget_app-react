import {  type FC, useContext } from 'react';
import { BsCashCoin, BsCreditCard2Back } from 'react-icons/bs'
import { DataContext } from '../../../Context/DataProvider';
import moment from 'moment';
import { MdAccountBalance } from 'react-icons/md'


interface TableProps {
    transactionData:any
}

const Table: FC<TableProps> = ({ transactionData }) => {
    const { selectedTransaction, setSelectedTransaction } = useContext(DataContext);
    
    // const [hideChecBox, setHideChecBox] = useState(false)

    const handleCheckboxChange = (item: any) => {
        if (selectedTransaction.find((selected: any): any => item._id === selected._id)) {
            setSelectedTransaction(selectedTransaction.filter((selected: any) => selected._id !== item._id));
        } else {
            setSelectedTransaction([...selectedTransaction, { _id: item._id }]);
        }
    };
    const handleParentChange = (e: any) => {
        if (e.target.checked) {
            const arraOfIds = transactionData.map((transaction: any) => { return ({ _id: transaction._id }) })
            setSelectedTransaction(arraOfIds)
        } else {
            setSelectedTransaction([])
        }
    }
 
    return (
        <div className="w-full h-full overflow-y-auto shadow-md">
            <div className="shadow-md lg:block hidden">
                <table className="w-full relative text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        checked={transactionData?.length === selectedTransaction?.length ? true : false}
                                        onChange={(e) => handleParentChange(e)}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 " />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-4 truncate py-3">
                                Category
                            </th>
                            <th scope="col" className="px-4 truncate py-3">
                                Date
                            </th>
                            <th scope="col" className="px-4 truncate py-3">
                                Payment Mode
                            </th>
                            <th scope="col" className="px-4 truncate py-3">
                                Description
                            </th>
                            <th scope="col" className="px-4 truncate py-3">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionData?.map((item: any) =>
                            <tr key={item._id} className="bg-white border-b cursor-default hover:bg-gray-50 hover:text-gray-800">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            value={item?._id}
                                            id={`checkbox-table-search-${item._id}`}
                                            type="checkbox"
                                            checked={selectedTransaction.find((selected: any): any => item._id === selected._id) ? true : false}
                                            onChange={() => handleCheckboxChange(item)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 " />
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th title={item?.category} className="px-4 truncate py-4">
                                    {item?.category}
                                </th>
                                <td title={item?.created_at} className="px-4 truncate py-4">
                                    {moment(item?.date).format('DD MMM YYYY')}
                                </td>
                                <td title={item?.paymentMethod} className="px-4 truncate py-4 flex items-center gap-1">
                                    {item?.paymentMethod === 'Cash' ? <BsCashCoin className='text-lg' /> : item?.paymentMethod === 'Account' ? <MdAccountBalance className='text-lg' /> : item?.paymentMethod === 'Card' ? <BsCreditCard2Back className='text-lg' /> : 'NaN'}{item?.paymentMethod !== 'Cash' && '**'}{item?.from}
                                </td>
                                <td title={item?.description} className="px-4 max-w-[8rem] sm:max-w-[12rem] truncate py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {item?.description}
                                </td>
                                <td title={item?.amount} className={`${item?.action === 'income' ? 'text-green-500' : item?.action === 'expence' ? 'text-red-500' : ''} px-4 truncate py-4`}>
                                    {item?.action === 'income' ? '+' : item?.action === 'expence' ? '-' : ''}{item?.amount}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='w-full h-full rounded-lg lg:hidden block  text-sm text-left text-gray-700'>
                <div className={` w-full bg-gray-200 h-10 flex items-center`}>
                    <span className="p-4">
                        <div className="flex gap-3 items-center">
                            <input
                                checked={transactionData?.length === selectedTransaction?.length ? true : false}
                                onChange={(e) => handleParentChange(e)}
                                id="checkbox-all-search"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 " />
                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                    </span>
                    <p className='text-gray-700 text-lg'>Sellect All</p>
                </div>
                {transactionData?.map((item: any) =>
                    <div
                    //  onClick={() => setHideChecBox(true)}
                     key={item._id} className='flex justify-between border-b p-2'>
                        <div className='flex items-center gap-2'>
                            <span className="w-4">
                                <div className="flex items-center">
                                    <input
                                        value={item?._id}
                                        id={`checkbox-table-search-${item._id}`}
                                        type="checkbox"
                                        checked={selectedTransaction.find((selected: any): any => item._id === selected._id) ? true : false}
                                        onChange={() => handleCheckboxChange(item)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 " />
                                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                            </span>
                            <div className='flex flex-col gap-1 sm:max-w-[15rem] max-w-[10rem] truncate '>
                                <div>{item?.category}</div>
                                <div className='text-gray-900 sm:text-lg  text-base'> {item?.description}</div>
                                <div className='flex items-center gap-1'>{item?.paymentMethod === 'Cash' ? <BsCashCoin className='text-lg' /> : item?.paymentMethod === 'Account' ? <MdAccountBalance className='text-lg' /> : item?.paymentMethod === 'Card' ? <BsCreditCard2Back className='text-lg' /> : 'NaN'}{item?.paymentMethod !== 'Cash' && '**'}{item?.from}</div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between text-base truncate'>
                            <div className={`${item?.action === 'income' ? 'text-green-500' : item?.action === 'expence' ? 'text-red-500' : ''}`}>{item?.action === 'income' ? '+' : item?.action === 'expence' ? '-' : ''}{item?.amount}</div>
                            <div>{moment(item?.date).format('DD MMM YYYY')}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Table;
