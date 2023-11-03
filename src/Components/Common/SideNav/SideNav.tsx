import type { FC } from 'react';
import { FaChartLine } from 'react-icons/fa'
import { RxDashboard } from 'react-icons/rx'
import { CiBank } from 'react-icons/ci'
import { AiOutlineFileDone } from 'react-icons/ai'
import { NavLink } from 'react-router-dom';
import { SlCalculator } from 'react-icons/sl';
import { TbChartHistogram } from 'react-icons/tb';

interface SideNavProps { }
const SideNav: FC<SideNavProps> = () => {
    return (
        <div className='w-full h-full bg-skin-bg-sideNav'>
            <div className='w-full h-full flex flex-col items-center'>
                <FaChartLine title='Your Financial Partner' className='text-7xl text-skin-logo mt-5' />
                <span className='text-xs text-yellow-300 cursor-default font-semibold'>Expense Tracker</span>
                <div className=' h-full w-full text-md font-medium flex flex-col gap-6 mt-12 pl-2'>
                    <NavLink to='dashBoard' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'}`}>
                        <span className='flex items-center gap-3'><RxDashboard className='text-2xl' /> Dashboard</span>
                    </NavLink>
                    <NavLink to='Card&Accounts' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'}`}>
                        <span className='flex items-center gap-3'><CiBank className='text-2xl' />Cards & Accounts</span>
                    </NavLink>
                    <NavLink to='transactions' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'}`}>
                        <span className='flex items-center gap-3'><AiOutlineFileDone className='text-2xl' /> Transactions</span>
                    </NavLink>
                    <NavLink to='investment' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'}`}>
                        <span className='flex items-center gap-3'><TbChartHistogram className='text-2xl' /> Investments</span>
                    </NavLink>
                    <NavLink to='calculator' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'}`}>
                        <span className='flex items-center gap-3'><SlCalculator className='text-2xl' /> Calculator</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default SideNav;
