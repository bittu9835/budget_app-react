import { useState, type FC, useEffect } from 'react';
import bg from '../../../Assets/Login.jpg'
import icon from '../../../Assets/favicon1.png'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { motion, useAnimation } from 'framer-motion';
import GoogleLoginButton from '../GoogleLogin';

interface SignInProps { }

const SignIn: FC<SignInProps> = () => {
    const [togglePassIcon, setTogglePassIcon] = useState(true)
    const navigate = useNavigate()
    const cardControls = useAnimation();
    const [isLoading, setIsLoading] = useState(false)

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required!'),
        password: Yup.string().required('Password is required!')
            .min(8, 'Password must be 8 characters long')
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
    });

    const handleLogin = async (values: any) => {
        setTogglePassIcon(true)
        setIsLoading(true)
        try {
            const response: any = await http({
                url: "/auth/login",
                method: 'post',
                data: values
            });
            if (response?.data?.code === 'SUCCESS_200') {
                sessionStorage.setItem('token', response.data.data.jwtToken);
                sessionStorage.setItem('userDetails', JSON.stringify(response.data.data.userDetail))
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate('home/dashBoard');
                    setIsLoading(false)
                }, 1000);
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            setIsLoading(false)
            toast.warn(error?.response?.data?.message);
            toast.error(error?.message);
        }
    }

    const animationVariants = {
        initial: { scale: 0.5, opacity: 0, rotate: -90 }, // Added 'rotate' property
        animate: { scale: 1, opacity: 1, rotate: 0 },   // Added 'rotate' property
    };
    useEffect(() => {
        // Trigger the animation when the component mounts
        cardControls.start('animate');
    }, [cardControls]);

    return (
        <motion.div
            initial="initial"
            animate={cardControls}
            variants={animationVariants}
            className='w-screen h-screen relative'>
            <p className='absolute top-2 right-4 z-10  text-white'>Don't have Account ? <span onClick={() => navigate('/signUp')} className='text-violet-800 font-bold cursor-pointer ml-1'> SignUp</span> </p>
            <div className='w-full h-full relative md:bg-transparent bg-black'>
                <img className='md:block hidden w-full h-full' src={bg} alt="" />
                {/* <img className='block md:hidden w-full h-1/2 animate-pulse' src={bg2} alt="" /> */}
                <div className='md:w-[40%] w-full absolute top-20 right-0 px-10 md:px-4 md:mr-2'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleLogin}
                        validationSchema={validationSchema}
                    >

                        <Form className='w-full flex  flex-col items-center'>
                            <img className='w-20 h-20 rounded-full' src={icon} alt="" />
                            <div className='text-white text-3xl font-bold mb-5 mt-2'>Login</div>
                            <div className='w-full flex justify-center flex-col gap-10'>
                                <div className='w-full'>
                                    <Field className='w-full border-b text-white outline-none bg-transparent font-medium pb-2 placeholder:text-gray-200' type="email" name='email' id='email' placeholder='Email' />
                                    <span className="text-yellow-400 text-sm"><ErrorMessage name="email" /></span>
                                </div>

                                <div className='w-full relative'>
                                    <Field className='w-full text-white border-b outline-none bg-transparent font-medium pb-2 placeholder:text-gray-200' type={`${togglePassIcon ? 'password' : 'text'}`} name='password' id='password' placeholder='Password' />
                                    <span onClick={() => setTogglePassIcon(!togglePassIcon)} className='absolute text-xl text-white right-2 cursor-pointer'>{togglePassIcon ? <FaEye /> : <FaEyeSlash />}</span>
                                    <span className="text-yellow-400 text-sm"><ErrorMessage name="password" /></span>
                                </div>
                            </div>
                            <div className='w-full'>
                                <div className=''>
                                    <p className='text-white mt-4 underline hover:text-blue-900 cursor-pointer'>Forgot Password</p>
                                </div>
                                {isLoading ?
                                    <div className='bg-green-500 w-full h-[2.25rem] flex items-center justify-center mt-7 rounded-md shadow-md'>
                                        <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                                    </div>
                                    :
                                    <>
                                        <div className=' w-full h-[2.25rem] mt-7 rounded-md shadow-md mb-2'>
                                            <button type='submit' className='bg-green-600 hover:bg-green-500 active:bg-green-600 text-white rounded-md w-full h-full font-extrabold transition ease-in-out duration-150'>Login</button>
                                        </div>
                                        <GoogleLoginButton />
                                    </>
                                }


                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </motion.div>
    );
}

export default SignIn;
