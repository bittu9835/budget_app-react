import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../../Home/Home';
import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import MpinLogin from '../Auth/MpinLogin/MpinLogin';
import SetMpin from '../Auth/SetMpin/SetMpin';
import Dashboard from '../Pages/Dashboard/Dashboars';
import BankAccounts from '../Pages/BankAccounts/BankAccounts';
import PageNoteFound from '../Common/PageNoteFound/PageNoteFound';
import Transactions from '../Pages/Transactions/Transactions';
import Calculator from '../Pages/Calculator/Calculator';
import Investment from '../Pages/Investment/Investment';
import Settings from '../Pages/Settings/Settings';
import { isMpinSet, isMpinVerified } from '../../Services/mpinUtils';

// ─── Guards ───────────────────────────────────────────────────────────────────

// /setup-mpin — only accessible when logged in and MPIN not yet configured
const SetMpinGuard: FC = () => {
    if (!localStorage.getItem('token')) return <Navigate to="/" replace />;
    if (isMpinSet()) return <Navigate to="/mpin" replace />;
    return <SetMpin />;
};

// /mpin — only accessible when logged in and MPIN is configured
const MpinGuard: FC = () => {
    if (!localStorage.getItem('token')) return <Navigate to="/" replace />;
    if (!isMpinSet()) return <Navigate to="/setup-mpin" replace />;
    if (isMpinVerified()) return <Navigate to="/home/dashBoard" replace />;
    return <MpinLogin />;
};

// ─── Router ───────────────────────────────────────────────────────────────────

const Router: FC = () => {
    return (
        <Routes>
            <Route path='/'           element={<SignIn />} />
            <Route path='/signUp'     element={<SignUp />} />
            <Route path='/setup-mpin' element={<SetMpinGuard />} />
            <Route path='/mpin'       element={<MpinGuard />} />
            <Route path='*'           element={<PageNoteFound />} />
            <Route path='/home'       element={<Home />}>
                <Route path='dashBoard'             element={<Dashboard />} />
                <Route path='transactions'          element={<Transactions />} />
                <Route path='transactions/:filter'  element={<Transactions />} />
                <Route path='Card&Accounts'         element={<BankAccounts />} />
                <Route path='calculator'            element={<Calculator />} />
                <Route path='investment'            element={<Investment />} />
                <Route path='settings'              element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default Router;
