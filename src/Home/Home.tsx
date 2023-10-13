import { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import pluse from '../Assets/bplus.png'
import AddTransactions from '../Components/Pages/AddTransactions/AddTransactions';


interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const [openFotm,setOpenForm]=useState(false)
    const [theme,setTheme]=useState('')
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
                <SideNav theme={theme}/>
            </div>
            <div className='w-full h-full'>
                <div className='w-full h-[8vh]'>
                    <TopNav setTheme={setTheme}/>
                </div>
                <div className='h-[85vh] lg:h-[92vh]  w-full scrollbar-thin'>
                    <div onClick={()=>setOpenForm(true)} title='Add Transactions' className='absolute lg:right-12 z-30 right-4 lg:bottom-12 bottom-20 '>
                        <img className='cursor-pointer w-14 h-14 rounded-lg' src={pluse} alt="" />
                    </div>
                    <Outlet />
                </div>
                <div className='block lg:hidden w-full h-[7vh] absolute bottom-0'>
                    <BottonNav />
                </div>
            </div>
            <AddTransactions openFotm={openFotm} setOpenForm={setOpenForm}/>
        </div>
    );
}

export default Home;