import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../Home/Home';
import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import Dashboard from '../Pages/Dashboard/Dashboars';
import Cards from '../Pages/Cards/Cards';
import BankAccounts from '../Pages/BankAccounts/BankAccounts';
import Settings from '../Pages/Settings/Settings';
import PageNoteFound from '../Common/PageNoteFound/PageNoteFound';
import Transactions from '../Pages/Transactions/Transactions';

interface RouterProps { }

const Router: FC<RouterProps> = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='*' element={<PageNoteFound/>} />
                <Route path='/home' element={<Home />}>
                    <Route path='dashBoard' element={<Dashboard />} />
                    <Route path='transactions' element={<Transactions />} />
                    <Route path='cards' element={<Cards />} />
                    <Route path='bankAccounts' element={<BankAccounts />} />
                    <Route path='settings' element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
}

export default Router;
