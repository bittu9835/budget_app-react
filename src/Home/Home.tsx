import { FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import pluse from '../Assets/bplus.png'



interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    let login = sessionStorage.getItem('token');
    useEffect(() => {
        if (!login) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [login]);
    return (
        <div className='w-screen h-screen bg-white flex transition-all duration-300 relative scrollbar-thumb-slate-800'>
            <div className='w-[20rem] h-full hidden lg:block'>
                <SideNav />
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-[8vh]'>
                    <TopNav />
                </div>
                <div className='h-[85vh] lg:h-[92vh]  w-full scrollbar-thin'>
                    <div onClick={() => navigate('add')} title='Add Transactions' className={`${pathname === '/home/add' ? 'hidden' : ''} absolute lg:right-12 z-30 right-4 lg:bottom-12 bottom-20 `}>
                        <img className='cursor-pointer w-14 h-14 rounded-lg' src={pluse} alt="" />
                    </div>
                    <Outlet />
                </div>
                <div className='block lg:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
        </div>
    );
}

export default Home;