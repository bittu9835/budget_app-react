import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../Home/Home';
import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import Dashboard from '../Pages/Dashboard/Dashboars';
import BankAccounts from '../Pages/BankAccounts/BankAccounts';
import Settings from '../Pages/Settings/Settings';
import PageNoteFound from '../Common/PageNoteFound/PageNoteFound';
import Transactions from '../Pages/Transactions/Transactions';
import Calculator from '../Pages/Calculator/Calculator';
import Investment from '../Pages/Investment/Investment';

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
                    <Route path='Card&Accounts' element={<BankAccounts />} />
                    <Route path='calculator' element={<Calculator />} />
                    <Route path='investment' element={<Investment />} />
                    <Route path='settings' element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
}

export default Router;
