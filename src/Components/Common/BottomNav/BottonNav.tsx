import type { FC } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { CiBank } from 'react-icons/ci';
import { AiOutlineFileDone } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineMenuBook } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

interface BottonNavProps { }

const navItems = [
    { to: 'Card&Accounts', icon: CiBank,              label: 'Accounts' },
    { to: 'khatabook',     icon: MdOutlineMenuBook,   label: 'Khatabook' },
    { to: 'dashBoard',     icon: RxDashboard,         label: 'Dashboard' },
    { to: 'settings',      icon: IoSettingsOutline,   label: 'Settings' },
    { to: 'transactions',  icon: AiOutlineFileDone,   label: 'Ledger' },
];

const BottonNav: FC<BottonNavProps> = () => {
    return (
        <div className='w-full h-full bg-skin-bg-sideNav flex items-center justify-around px-1'>
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-[2px] flex-1 h-full transition-all duration-200 ${
                            isActive
                                ? 'text-skin-active-nav-text'
                                : 'text-skin-sideNav-text opacity-70'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span className={`text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                <Icon />
                            </span>
                            <span className='text-[9px] font-semibold tracking-wide'>{label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
};

export default BottonNav;
