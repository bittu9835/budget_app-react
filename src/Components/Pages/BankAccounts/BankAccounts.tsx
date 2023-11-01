import { useState, type FC } from 'react';
import visa from '../../../Assets/Visa_Inc._logo.svg.png'
import chip from '../../../Assets/chip.png'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';

interface BankAccountsProps { }

const BankAccounts: FC<BankAccountsProps> = () => {
    const [openBankForm, setOpenBankForm] = useState(false)
    const [accountForEdit, setAccountForEdit] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const initialValues = {

    }

    const validationSchema = Yup.object().shape({
        Account_number: Yup.string().matches(/^[0-9]{4}$/, 'Last 4 digits of account number is required.').required('Enter A/C No.'),
        bankName: Yup.string().required('Add Description').max(100, 'Too Long'),
    });

    const handleAddCard = () => {
        setOpenBankForm(true)
    }

    const handleAddBank = () => {
        setOpenBankForm(true)
    }

    const handleSubmit = () => {

    }
    return (
        <div className='w-full h-full relative'>
            <div className={`w-full h-full ${openBankForm ? 'block' : 'hidden'} absolute z-40 top-0 bg-black bg-opacity-90  transition-all duration-300 flex items-center justify-center`}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    {({ values, setFieldValue }) => (
                        <Form className='sm:w-[33rem] bg-white w-full h-full sm:h-auto  rounded-sm p-6'>
                            <div className='flex items-center justify-between mb-5'>
                                <p className='text-lg'>{accountForEdit !== null ? 'Edit' : 'New'} Transaction</p>
                                <p onClick={() => {
                                    setOpenBankForm(false)
                                    setAccountForEdit('')
                                }} className='p-2 text-lg flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer'><IoClose /></p>
                            </div>
                            <div>
                                <span className='text-xs text-red-500'><ErrorMessage name='bankName' /></span>
                                <span className='text-xs text-red-500'><ErrorMessage name='Account_number' /></span>
                            </div>
                            <div className='px-5 w-full flex text-sm text-gray-800 sm:mt-2 mt-10 flex-col gap-10 '>
                                <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                    <div title='Enter Amount' className='w-full sm:w-1/2'>
                                        <label htmlFor="bankName">Enter Bank Name</label>
                                        <Field
                                            className={`pl-5 text-sm outline-none bg-transparent border-b border-gray-700 font-semibold  w-full appearance-none`}
                                            type='string'
                                            name='bankName'
                                            id='bankName'
                                        />
                                    </div>
                                    <div title='Enter Description' className='w-full sm:w-1/2'>
                                        <label htmlFor="Account_number">Last 4 Digit of A/C No.</label>
                                        <Field
                                            className='w-full border-b border-gray-700 font-semibold  appearance-none outline-none bg-transparent'
                                            type='number'
                                            name='Account_number'
                                            id='Account_number'
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-5 font-medium justify-end mt-5'>
                                    {isLoading ?
                                        <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                            <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                                        </div>
                                        :
                                        <button
                                            type='submit'
                                            // disabled={values.action === 'income' || values.action === 'expence' ? false : true}
                                            className={`bg-[#5200bb] py-[2px] px-4   text-white  rounded-sm`}>
                                            {accountForEdit !== null ? 'Update' : 'Add'}
                                        </button>
                                    }


                                    <div onClick={() => {
                                        setOpenBankForm(false)
                                        setAccountForEdit('')
                                    }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className='w-full h-full py-5 flex sm:justify-evenly px-7 sm:flex-row md:gap-4 gap-12 flex-col'>
                <div className='w-full lg:w-80 md:w-52 flex flex-col items-center'>
                    <div className="w-full cursor-default h-48 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-4 relative shadow-md">
                        <div className="absolute top-4 left-4">
                            <img src={visa} alt="" className="w-16" />
                        </div>
                        <p title='State Bank Of India' className='text-blue-800 font-extrabold absolute top-2 right-2 text-xl'>SBI</p>
                        <div className="text-white text-2xl font-semibold absolute bottom-20 left-4">
                            **** **** **** 3456
                        </div>
                        <div className="text-white text-base absolute font-medium bottom-7 left-4">
                            Bittu Kumar
                        </div>
                        <div className="absolute bottom-8 right-4">
                            <img src={chip} alt="" className="w-10" />
                        </div>
                    </div>
                    <div onClick={handleAddCard} className='mt-4'>
                        <p className='text-[#5200bb] cursor-pointer font-semibold'>Add Cards (+)</p>
                    </div>
                </div>
                <div className='w-full lg:w-80 md:w-52 flex flex-col items-center'>
                    <div className="bg-white px-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg shadow-md w-full   h-48">
                        <div className="cursor-default">
                            <div className='mb-2 flex justify-between items-center'>
                            <div className="">
                                <label className="text-sm text-white">Account Number</label>
                                <p className="text-lg text-white font-semibold">**** **** 3456</p>
                            </div>
                            <p title='State Bank Of India' className='text-blue-800 font-extrabold mr-1 text-xl'>SBI</p>
                            </div>
                            <div className="mb-2">
                                <label className="text-sm text-white">Account Holder</label>
                                <p className="text-lg text-white font-semibold">Bittu kumar</p>
                            </div>
                        </div>
                        <div className="mt-2 border-t cursor-default border-gray-300 pt-2 text-center">
                            <p className="text-sm text-white">A/C Balance</p>
                            <p className="text-lg font-semibold text-white">₹ 500.00</p>
                        </div>
                    </div>
                    <div onClick={handleAddBank} className='mt-4'>
                        <p className='text-[#5200bb] cursor-pointer font-semibold'>Add Accounts (+)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankAccounts;
