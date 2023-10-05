import { FC } from 'react';
import { Outlet} from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';


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
            <div className='w-screen h-screen bg-white transition-all duration-300'>
                <div className='w-full h-auto'>
                   <TopNav/>
                </div>
                <div className='h-[92vh] flex w-full relative'>
                    <div className='w-full  h-full  overflow-y-auto'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;