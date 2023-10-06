import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';


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
        <>
            <div className='w-screen h-screen bg-white transition-all duration-300 relative'>
                <div className='w-full h-[8vh]'>
                    <TopNav />
                </div>
                <div className='h-[85vh] md:h-[92vh] md:flex'>
                    <div className='hidden md:block w-44 h-full bg-zinc-800'>
                        bittu
                    </div>
                    <div className='h-full w-full '>
                        <Outlet />
                    </div>
                </div>
                <div className='block md:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
        </>
    );
}

export default Home;