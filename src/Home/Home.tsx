import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import pluse from '../Assets/bplus.png'



interface HomeProps { }

const Home: FC<HomeProps> = () => {

    // const navigate = useNavigate();
    // let login = localStorage.getItem('token');
    // useEffect(() => {
    //     if (!login) {
    //         navigate('/signin')
    //     }

    // }, [login]);

    return (
        <div className='w-screen h-screen bg-white flex transition-all duration-300 relative scrollbar-thumb-slate-800'>
            <div className='w-[20rem] h-full hidden md:block'>
                <SideNav />
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-[8vh]'>
                    <TopNav />
                </div>
                <div className='h-[85vh] md:h-[92vh]  w-full sm:scrollbar-thin'>
                    <div title='Add Transactions' className='absolute sm:right-12 right-4 sm:bottom-12 bottom-20 '>
                        <img className='cursor-pointer w-14 h-14 rounded-lg' src={pluse} alt="" />
                    </div>
                    <Outlet />
                </div>
                <div className='block md:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
        </div>
    );
}

export default Home;