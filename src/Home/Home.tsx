import { FC, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import AddTransactions from '../Components/Pages/AddTransactions/AddTransactions';
import { DataContext } from '../Context/DataProvider';


interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const { setProfileToggle,openFotm,setOpenForm, theme} = useContext(DataContext)
    let login = localStorage.getItem('token');


    useEffect(() => {
        if (!login) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [login]);

    return (
        <div className={`${theme} w-screen h-screen flex transition-all duration-300 overflow-y-auto relative scrollbar-thumb-slate-800`}>
            <div className='min-w-[15rem] w-[15rem] h-full hidden md:block'>
                <SideNav/>
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-[8vh]'>
                    <TopNav/>
                </div>
                <div onClick={()=>setProfileToggle(false)} className='h-[85vh] md:h-[92vh] overflow-auto bg-skin-bg-outlet w-full scrollbar-thin'>
                    <Outlet />
                </div>
                <div className='block md:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
            {openFotm && <AddTransactions openFotm={openFotm} setOpenForm={setOpenForm}/>}
        </div>
    );
}

export default Home;