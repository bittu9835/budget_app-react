import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../Home/Home';
import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import Dashboard from '../Pages/Dashboard/Dashboars';

interface RouterProps { }

const Router: FC<RouterProps> = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='*' element={<>Page Note Found!</>} />
                <Route path='/home' element={<Home />}>
                    <Route path='dashBoard' element={<Dashboard />} />
                </Route>
            </Routes>
        </>
    );
}

export default Router;
