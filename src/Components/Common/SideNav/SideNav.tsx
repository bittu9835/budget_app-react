import type { FC } from 'react';
import {FaChartLine} from 'react-icons/fa'
import {RxDashboard} from 'react-icons/rx'
import {CiBank} from 'react-icons/ci'
import {AiOutlineFileDone} from 'react-icons/ai'
import {IoSettingsOutline} from 'react-icons/io5'
import {LiaCreditCardSolid} from 'react-icons/lia'
import { NavLink } from 'react-router-dom';
import { SlCalculator } from 'react-icons/sl';

interface SideNavProps {}

const SideNav: FC<SideNavProps> = () => {
    return (
        <div className='w-full h-full bg-[#5200bb]'>
            <div className='w-full h-full flex flex-col items-center'>
            <FaChartLine title='Your Financial Partner' className='text-7xl text-white mt-5'/>
            <span className='text-xs text-yellow-300 cursor-default font-semibold'>Expense Tracker</span>
            <div className='h-full w-full text-xl font-bold text-white flex flex-col gap-6 mt-12 pl-5'>
            <NavLink to='dashBoard' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><RxDashboard className='text-2xl'/> DASHBOARD</span>
            </NavLink>
            <NavLink to='transactions' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><AiOutlineFileDone className='text-2xl'/> TRANSACTIONS</span>
            </NavLink>
            <NavLink to='cards' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><LiaCreditCardSolid className='text-2xl'/> CARDS</span>
            </NavLink>
            <NavLink to='bankAccounts' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><CiBank className='text-2xl'/> BANK ACCOUNTS</span>
            </NavLink>
            <NavLink to='calculator' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><SlCalculator className='text-2xl'/> Calculator</span>
            </NavLink>
            <NavLink to='settings' className=' hover:translate-x-3 transition-all duration-300'>
                <span className='flex items-center gap-3'><IoSettingsOutline className='text-2xl'/> SETTINGS</span>
            </NavLink>
            </div>
            </div>

            
        </div>
    );
}

export default SideNav;
