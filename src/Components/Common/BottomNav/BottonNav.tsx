import type { FC } from 'react';
import { RxDashboard } from 'react-icons/rx'
import { CiBank } from 'react-icons/ci'
import { AiOutlineFileDone } from 'react-icons/ai'
import { IoSettingsOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom';
import { SlCalculator } from 'react-icons/sl';
interface BottonNavProps { }

const BottonNav: FC<BottonNavProps> = () => {
    return (
        <div className='w-full h-full bg-skin-bg-sideNav flex items-center justify-between px-5'>
            <NavLink to='bankAccounts' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'} cursor-pointer text-3xl `}><CiBank />
            </NavLink>
            <NavLink to='calculator' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'} cursor-pointer text-3xl `}><SlCalculator className='text-2xl'/>
            </NavLink >
            <div className='text-4xl invisible'><RxDashboard /></div>
            <NavLink to='dashBoard' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-text'} cursor-pointer text-4xl w-12 h-12 bg-skin-bg-outlet rounded-md flex justify-center items-center absolute -top-4 left-1/2 transform -translate-x-1/2 `}><RxDashboard />
            </NavLink>
            <NavLink to='settings' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'} cursor-pointer text-3xl `}><IoSettingsOutline />
            </NavLink>
            <NavLink to='transactions' className={({ isActive, }) => `${isActive ? 'text-skin-active-nav-text' : 'text-skin-sideNav-text'} cursor-pointer text-3xl `}><AiOutlineFileDone />
            </NavLink>
        </div>
    );
}

export default BottonNav;
