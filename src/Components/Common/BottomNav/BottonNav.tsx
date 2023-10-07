import type { FC } from 'react';
import { RxDashboard } from 'react-icons/rx'
import { CiBank } from 'react-icons/ci'
import { AiOutlineFileDone } from 'react-icons/ai'
import { IoSettingsOutline } from 'react-icons/io5'
import { LiaCreditCardSolid } from 'react-icons/lia'
import { useNavigate } from 'react-router-dom';
interface BottonNavProps { }

const BottonNav: FC<BottonNavProps> = () => {
    const navigate=useNavigate()
    return (
        <div className='w-full h-full bg-gray-100 flex items-center justify-between px-5 text-gray-700'>
            <div onClick={()=>navigate('bankAccounts')} className='cursor-pointer text-3xl'><CiBank /></div>
            <div onClick={()=>navigate('cards')} className='cursor-pointer text-3xl'><LiaCreditCardSolid /></div>
            <div className='text-4xl invisible'><RxDashboard /></div>
            <div onClick={()=>navigate('dashBoard')} className='cursor-pointer text-4xl w-12 h-12 bg-white rounded-md flex justify-center items-center absolute -top-4 left-1/2 transform -translate-x-1/2 '><RxDashboard /></div>
            <div onClick={()=>navigate('settings')} className='cursor-pointer text-3xl'><IoSettingsOutline /></div>
            <div onClick={()=>navigate('transactions')} className='cursor-pointer text-3xl'><AiOutlineFileDone /></div>
        </div>
    );
}

export default BottonNav;
