import type { FC } from 'react';
import { BsCashCoin } from 'react-icons/bs'


interface TableProps { }

const Table: FC<TableProps> = () => {
    return (
        <div className="w-full h-full shadow-md rounded-lg overflow-y-auto scrollbar-none">
            <div className='flex justify-between mb-3 px-1'>
                <p className='text-gray-500 font-semibold truncate'>Latest Transactions</p>
                <input className='w-40 h-6 focus:outline-none text-sm text-gray-800 font-semibold px-2 py-1 border rounded-md placeholder:text-sm placeholder:font-semibold' placeholder='search..' type="search" />
            </div>
            <table className="w-full text-sm text-left text-gray-500 relative">
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
                            By
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b">
                        <th title='Discription' className="max-w-[50px] px-1 py-4 truncate">
                            bittu kumar jhrb kebh iwebv i;uvb eiuvb uj jebwjeh wufyg ef fhuhef eff of fhf fqufygeiqufgy
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4">
                            bittu kumar singh
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4">
                            bittu kumar singh
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4">
                            bittu kumar singh
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4">
                            bittu kumar singh
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                    <tr className="bg-white border-b">
                        <th className="px-1 py-4 truncate">
                            bittu kumar
                        </th>
                        <td className="px-1 py-4">
                            05/12/2023
                        </td>
                        <td className="px-1 py-4">
                            $400
                        </td>
                        <td className="px-3 py-4">
                            <BsCashCoin />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Table;
