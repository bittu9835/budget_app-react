import { FC, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNav from '../Components/Common/TopNav/TopNav';
import BottonNav from '../Components/Common/BottomNav/BottonNav';
import SideNav from '../Components/Common/SideNav/SideNav';
import AddTransactions from '../Components/Pages/AddTransactions/AddTransactions';
import OfflineBanner from '../Components/Common/OfflineBanner/OfflineBanner';
import { DataContext } from '../Context/DataProvider';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { isMpinSet, isMpinVerified } from '../Services/mpinUtils';


interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const { setProfileToggle, openFotm, setOpenForm, theme, setDbStatus, setRender } = useContext(DataContext);

    const onSyncComplete = () => {
        setDbStatus(true);
        setRender((prev: boolean) => !prev);
    };

    const { isOnline, isSyncing, triggerSync } = useNetworkStatus(onSyncComplete);
    let login = localStorage.getItem('token');

    // Initial sync on mount (when online)
    useEffect(() => {
        if (login && isOnline) {
            triggerSync();
        }
        // eslint-disable-next-line
    }, [login]);

    // Auth + MPIN guard
    useEffect(() => {
        if (!login) {
            navigate('/');
        } else if (isMpinSet() && !isMpinVerified()) {
            navigate('/mpin');
        }
        // eslint-disable-next-line
    }, [login]);

    return (
        <div className={`${theme} w-screen flex flex-col transition-all duration-300 overflow-hidden relative scrollbar-thumb-slate-800`} style={{ height: '100dvh' }}>
            {/* Offline / Syncing Banner — absolute top of the page */}
            <OfflineBanner isOnline={isOnline} isSyncing={isSyncing} />

            <div className='flex flex-1 overflow-hidden'>
                {/* Side Navigation — desktop only */}
                <div className='min-w-[15rem] w-[15rem] h-full hidden md:block'>
                    <SideNav />
                </div>

                <div className='w-full h-full flex flex-col'>
                    {/* Top Navigation */}
                    <div className='w-full h-[8vh] shrink-0'>
                        <TopNav />
                    </div>

                    {/* Main Content */}
                    <div onClick={() => setProfileToggle(false)} className='flex-1 overflow-auto bg-skin-bg-outlet w-full scrollbar-thin'>
                        <Outlet />
                    </div>

                    {/* Bottom Navigation — mobile only */}
                    <div className='block md:hidden w-full h-[7vh] shrink-0'>
                        <BottonNav />
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {openFotm && <AddTransactions openFotm={openFotm} setOpenForm={setOpenForm} />}
        </div>
    );
}

export default Home;