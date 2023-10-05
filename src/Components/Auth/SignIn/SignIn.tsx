import type { FC } from 'react';
import bg from '../../../Assets/Login.jpg'

interface SignInProps { }

const SignIn: FC<SignInProps> = () => {
    return (
        <>
            <div style={{ backgroundImage: `url(${bg})` }} className='w-screen h-screen bg-no-repeat bg-cover'>
                <div className=''>
                    <div className='w-full'>

                    </div>
                </div>
            </div>
        </>
    );
}

export default SignIn;
