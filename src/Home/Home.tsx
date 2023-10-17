import { FC, useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import AddTransactions from '../Components/Pages/AddTransactions/AddTransactions';
import { DataContext } from '../Context/DataProvider';


interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const [openFotm,setOpenForm]=useState(false)
    const { setProfileToggle, theme} = useContext(DataContext)
    let login = sessionStorage.getItem('token');
    useEffect(() => {
        if (!login) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [login]);

    return (
        <div className={`${theme} w-screen h-screen bg-white flex transition-all duration-300 relative scrollbar-thumb-slate-800`}>
            <div className='w-[20rem] h-full hidden lg:block'>
                <SideNav/>
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-[8vh]'>
                    <TopNav openFotm={openFotm} setOpenForm={setOpenForm}/>
                </div>
                <div onClick={()=>setProfileToggle(false)} className='h-[85vh] lg:h-[92vh]  w-full scrollbar-thin'>
                    <Outlet />
                </div>
                <div className='block lg:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
            {openFotm && <AddTransactions openFotm={openFotm} setOpenForm={setOpenForm}/>}
        </div>
    );
}

export default Home;