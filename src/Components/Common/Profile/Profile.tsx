import { useContext, type FC } from 'react';
import { BsFillShareFill } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import avatar from '../../../Assets/avtar.png'
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../../Context/DataProvider';


interface ProfileProps { }

const Profile: FC<ProfileProps> = () => {
    const nevigate = useNavigate()
    const { profileToggle, setProfileToggle, setTheme} = useContext(DataContext)


    const logout = () => {
        sessionStorage.clear()
        setProfileToggle(false)
        nevigate('/')
    }

    return (
            <div className={`${profileToggle ? 'translate-x-0' : 'translate-x-full'} bg-skin-bg-profile transition-all duration-300  shadow-md  fixed right-0 max-[550px]:right-0 top-14 rounded w-60 max-[550px]:w-full h-auto flex flex-col gap-5 p-5 max-[550px]:p-10 font-semibold text-skin-profile-text z-40 `}>

                <div className='flex items-center gap-5 cursor-pointer'>
                    <div className='w-8 h-8 rounded-[50%] border-[2px] p-[2px] border-skin-profile-border-hover cursor-pointer'>
                        <img className='w-full h-full rounded-full' src={avatar} alt="img" />
                    </div>
                    <p>Profile</p>
                </div>

                <div className='flex items-center gap-5 cursor-pointer  hover:text-skin-profile-text-hover '>
                    <div className='w-8 h-8 rounded-[50%] border-[2px] border-skin-profile-border hover:border-skin-profile-border-hover flex items-center justify-center'><BsFillShareFill className='text-sm' />
                    </div>
                    <p>Share</p>
                </div>

                <div onClick={logout} className='flex items-center gap-5 cursor-pointer  hover:text-red-500'>
                    <div className='w-8 h-8 rounded-[50%] border-[2px] border-skin-profile-border hover:border-red-500 flex items-center justify-center'><FiLogOut className='text-sm' />
                    </div>
                    <p className='text-red-500'>LogOut</p>
                </div>

                <div className='flex items-center gap-5 cursor-pointer'>
                    <div onClick={()=>setTheme('Default')} className='w-8 h-8 rounded-[50%] border-[2px] border-slate-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center'>
                    </div>
                    <div onClick={()=>setTheme('theme1')}  className='w-8 h-8 rounded-[50%] border-[2px] border-slate-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center'>
                    </div>
                    <div onClick={()=>setTheme('theme2')}  className='w-8 h-8 rounded-[50%] border-[2px] border-slate-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center'>
                    </div>
                    <div onClick={()=>setTheme('theme3')}  className='w-8 h-8 rounded-[50%] border-[2px] border-slate-300 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center'>
                    </div>
                </div>
            </div>
    );
}

export default Profile;