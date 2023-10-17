import { type FC, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlCalculator } from 'react-icons/sl'
import { FaPlus } from 'react-icons/fa'
import avtar from '../../../Assets/avtar.png'
import { IoSettingsOutline } from 'react-icons/io5';
import { DataContext } from '../../../Context/DataProvider';
import Profile from '../Profile/Profile';

interface TopNavProps {
    openFotm: boolean
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
}
const TopNav: FC<TopNavProps> = ({ openFotm, setOpenForm }) => {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const { pathname } = useLocation();
    const pageTitle = pathname?.split('/')?.[2]?.charAt(0)?.toUpperCase() + pathname?.split('/')?.[2]?.slice(1)
    const navigate = useNavigate()
    const { profileToggle, setProfileToggle } = useContext(DataContext)
    return (
        <div className='w-full h-full bg-skin-bg-topNav flex items-center justify-between sm:px-4 p-2'>
            <p className='text-2xl font-extrabold transition-all duration-300 text-gray-500 cursor-default'>{pageTitle}</p>
            <div className='flex items-center gap-2 h-full py-2'>
                <div onClick={() => setOpenForm(!openFotm)} title='Add Transaction' className='w-6 h-6 rounded-full cursor-pointer border border-[#5200bb] flex justify-center items-center text-[#5200bb]'>
                    <FaPlus />
                </div>
                <div onClick={() => { navigate('settings') }} title='Setting' className='sm:block hidden '><div className='w-6 h-6 rounded-full cursor-pointer bg-[#5200bb] flex justify-center items-center'><IoSettingsOutline className='text-white' /></div></div>
                <div title='Calculator' className=' cursor-pointer w-6 h-6 flex justify-center text-lg items-center text-[#5200bb]'><SlCalculator /></div>
                <div className='w-[1px] h-full border-l-2 border-[#5200bb]'></div>
                <div title={userDetails.name} className='w-12 truncate cursor-default text-sm font-semibold text-gray-800'>{userDetails.name}</div>
                <div onClick={() => setProfileToggle(!profileToggle)} title='Profile' className='cursor-pointer w-10 h-10 rounded-full border-2 border-[#5200bb]'><img className='w-full h-full rounded-full p-[2px]' src={avtar} alt="" />
                </div>
                <Profile />
            </div>
        </div>
    );
}

export default TopNav;
