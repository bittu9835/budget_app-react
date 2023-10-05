import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../Home/Home';
import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';

interface RouterProps {}

const Router: FC<RouterProps> = () => {
    return (
        <>
        <Routes>
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='*' element={<>Page Note Found!</>} />
                <Route path='/' element={<Home />}/>
            </Routes>
        </>
    );
}

export default Router;
