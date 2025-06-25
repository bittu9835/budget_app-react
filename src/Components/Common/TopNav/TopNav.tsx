import { type FC, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineRefresh } from "react-icons/hi";
import avtar from '../../../Assets/avtar.png'
import { DataContext } from '../../../Context/DataProvider';
import Profile from '../Profile/Profile';
import { FaPlus } from 'react-icons/fa';
import http from '../../../Services/http/http';

interface TopNavProps { }
const TopNav: FC<TopNavProps> = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const { pathname } = useLocation();
    const pageTitle = pathname?.split('/')?.[2]?.charAt(0)?.toUpperCase() + pathname?.split('/')?.[2]?.slice(1)
    // const navigate = useNavigate()
    const { profileToggle, setProfileToggle, setOpenForm, openFotm, dbStatus, setDbStatus } = useContext(DataContext)


    const checkDatabaseConnection = async () => {
        setDbStatus(false)
        try {
          const response: any = await http({
            url: `/auth/ping`,
            method: 'get',
            data: {
              email: userDetails.email
            }
          });
          if (response?.data?.code === 'SUCCESS_200') {
            setTimeout(() => {
                setDbStatus(true);
            }, 2000);
          } else {
            setDbStatus(false);
          }
        } catch (error) {
          setDbStatus(false);
          console.log(error, 'error');
        }
      };
    
    useEffect(() => {
        checkDatabaseConnection();
        // eslint-disable-next-line
    }, []);
    return (
        <div className='w-full h-full bg-skin-bg-topNav flex items-center justify-between sm:px-4 p-2'>
            <p className='text-lg font-medium transition-all duration-300 text-skin-topNav-secondery-text cursor-default'>{pageTitle}</p>
            <div className='flex items-center gap-2 h-full py-2'>
                <div onClick={() => setOpenForm(!openFotm)} title='Add Transaction' className='w-6 h-6 rounded-full cursor-pointer border border-skin-border flex justify-center items-center text-skin-topNav-text'>
                    <FaPlus />
                </div>
                <div title={dbStatus ? 'Database is connected' : 'Database is not connected'} className={`${dbStatus ? 'text-green-500' : 'text-red-500 animate-spin'} cursor-pointer w-8 h-8 flex justify-center text-lg items-center `} onClick={() => checkDatabaseConnection()}><HiOutlineRefresh /></div>
                <div className='w-[1px] h-full border-l-2 border-skin-border'></div>
                <div title={userDetails.name} className='w-[50px] truncate cursor-default text-sm font-semibold text-skin-topNav-secondery-text'>{userDetails.name}</div>
                <div onClick={() => setProfileToggle(!profileToggle)} title='Profile' className='cursor-pointer w-10 h-10 rounded-full border-2 border-skin-border'><img className='w-full h-full rounded-full p-[2px]' src={avtar} alt="" />
                </div>
                <Profile />
            </div>
        </div>
    );
}

export default TopNav;
