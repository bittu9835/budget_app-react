import { useContext, type FC } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../../Context/DataProvider';
import { IoSettingsOutline } from 'react-icons/io5';


interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {
    const nevigate = useNavigate()
    const { profileToggle, setProfileToggle} = useContext(DataContext)


    const logout = () => {
        localStorage.clear()
        setProfileToggle(false)
        nevigate('/')
    }

    return (
            <div className={`${profileToggle ? 'translate-x-0' : 'translate-x-full'} bg-skin-bg-profile transition-all duration-300  shadow-md  fixed right-0 max-[550px]:right-0 top-14 rounded w-60 max-[550px]:w-full h-auto flex flex-col gap-5 p-5 max-[550px]:p-10 font-semibold text-skin-profile-text z-40 `}>

                <div onClick={()=>nevigate('settings')} className='flex items-center gap-5 cursor-pointer'>
                    <div className='cursor-pointer'>
                        <IoSettingsOutline className='text-xl' />
                    </div>
                    <p>Settings</p>
                </div>

                <div onClick={logout} className='flex items-center gap-5 cursor-pointer  hover:text-red-500'>
                    <div className='cursor-pointer'><FiLogOut className='text-xl' />
                    </div>
                    <p className='text-red-500'>LogOut</p>
                </div>
            </div>
    );
}

export default Profile;