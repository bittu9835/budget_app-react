import { useState, type FC } from 'react';
import bg from '../../../Assets/Login.jpg'
import icon from '../../../Assets/favicon1.png'
import bg2 from '../../../Assets/bitcoin-6219345_1280.jpg'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface SignUpProps { }

const SignUp: FC<SignUpProps> = () => {
    const [togglePassIcon, setTogglePassIcon] = useState(true)
    const navigate = useNavigate()

    const initialValues = {
        name: '',
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, 'Name must be short').required('Name is required!'),
        email: Yup.string().email('Invalid email').required('Email is required!'),
        password: Yup.string().required('Password is required!')
            .min(8, 'Password must be 8 characters long')
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
    });

    const handleSignUp = () => {

    }
    return (
        <div className='w-screen h-screen relative'>
            <p className='absolute bottom-2 right-2 z-10  text-white'>Already have Account ? <span onClick={() => navigate('/')} className='text-violet-800 font-bold cursor-pointer ml-1'> SignIn</span> </p>
            <div className='w-full h-full relative md:bg-transparent bg-black'>
                <img className='md:block hidden w-full h-full' src={bg} alt="" />
                <img className='block md:hidden w-full h-1/2 animate-pulse' src={bg2} alt="" />
                <div className='md:w-[40%] w-full absolute top-20 right-0 px-10 md:px-4 md:mr-2'>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSignUp}
                        validationSchema={validationSchema}
                    >
                        <Form className='w-full flex  flex-col items-center '>
                            <img className='w-20 h-20 rounded-full mb-3' src={icon} alt="" />
                            <div className='text-white text-3xl font-bold mb-5'>SignUp</div>
                            <div className='w-full flex justify-center flex-col gap-10'>
                                <div className='w-full'>
                                    <Field className='w-full border-b text-white outline-none bg-transparent font-medium pb-2 placeholder:text-gray-200' type="text" name='name' id='name' placeholder='Full Name' />
                                    <span className="text-yellow-400 text-sm"><ErrorMessage name="name" /></span>
                                </div>
                                <div className='w-full'>
                                    <Field className='w-full border-b text-white outline-none bg-transparent font-medium pb-2 placeholder:text-gray-200' type="email" name='email' id='email' placeholder='User Name' />
                                    <span className="text-yellow-400 text-sm"><ErrorMessage name="email" /></span>
                                </div>
                                <div className='w-full relative'>
                                    <Field className='w-full text-white border-b outline-none bg-transparent font-medium pb-2 placeholder:text-gray-200' type={`${togglePassIcon ? 'password' : 'text'}`} name='password' id='password' placeholder='Password' />
                                    <span onClick={() => setTogglePassIcon(!togglePassIcon)} className='absolute text-xl text-white right-2 cursor-pointer'>{togglePassIcon ? <FaEye /> : <FaEyeSlash />}</span>
                                    <span className="text-yellow-400 text-sm"><ErrorMessage name="password" /></span>
                                </div>
                            </div>
                            <div className=' w-full h-[2.25rem] mt-7 rounded-md shadow-md'>
                                <button type='submit' className='bg-green-600 text-white focus:animate-ping rounded-md w-full h-full font-extrabold'>SignUp</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
