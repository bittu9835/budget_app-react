import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { SlCalculator } from 'react-icons/sl'
import { IoMdNotificationsOutline } from 'react-icons/io'
import avtar from '../../../Assets/avtar.png'

interface TopNavProps { }

const TopNav: FC<TopNavProps> = () => {
    const { pathname } = useLocation();
    const pageTitle = pathname?.split('/')?.[2]?.charAt(0)?.toUpperCase() + pathname?.split('/')?.[2]?.slice(1)
    return (
        <div className='w-full h-full bg-gray-50 flex items-center justify-between sm:px-4 p-2'>
            <p className='text-2xl font-extrabold transition-all duration-300 text-gray-500 cursor-default'>{pageTitle}</p>
            <div className='flex items-center gap-2 h-full py-2'>
                <div title='Add Transactions' className='sm:block hidden '><div className='w-6 h-6 rounded-full cursor-pointer bg-[#5200bb] flex justify-center items-center'><IoMdAdd className='text-white' /></div></div>
                <div title='Notifications' className='w-6 h-6 rounded-full cursor-pointer border border-[#5200bb] flex justify-center items-center text-[#5200bb] relative'>
                    <IoMdNotificationsOutline />
                    <p className='absolute w-2 h-2 bg-red-600 rounded-full top-0 -right-1 animate-pulse'></p>
                </div>
                <div title='Calculator' className=' cursor-pointer w-6 h-6 flex justify-center text-lg items-center text-[#5200bb]'><SlCalculator /></div>
                <div className='w-[1px] h-full border-l-2 border-[#5200bb]'></div>
                <div title='Full Name' className='cursor-default text-sm font-semibold text-gray-800'>Bittu</div>
                <div title='Profile' className='cursor-pointer w-10 h-10 rounded-full border-2 border-[#5200bb]'><img className='w-full h-full rounded-full p-[2px]' src={avtar} alt="" /></div>
            </div>
        </div>
    );
}

export default TopNav;
