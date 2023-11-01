import { useState, type FC } from 'react';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoAdd, IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface BankAccountsProps { }

const BankAccounts: FC<BankAccountsProps> = () => {
    const [openBankForm, setOpenBankForm] = useState(false)
    const [accountForEdit, setAccountForEdit] = useState(null)
    const [accountData, setAccountData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()


    const initialValues = {

    }

    const validationSchema = Yup.object().shape({
        Account_number: Yup.string().matches(/^[0-9]{4}$/, 'Last 4 digits of account number is required.').required('Enter A/C No.'),
        bankName: Yup.string().required('Add Description').max(50, 'Too Long'),
    });

    const handleAddCard = () => {
        setOpenBankForm(true)
    }

    const handleAddBank = () => {
        setOpenBankForm(true)
    }

    const handleClick = () => {
        navigate('/home/accountDetails')
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
                                <p className='text-lg'>{accountForEdit !== null ? 'Edit' : 'Add'} Account & Card</p>
                                <p onClick={() => {
                                    setOpenBankForm(false)
                                    setAccountForEdit(null)
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
                                        setAccountForEdit(null)
                                    }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="w-full h-full overflow-y-auto shadow-md">
                <div className="shadow-md rounded-lg">
                    <div className={` w-full bg-gray-100 h-10 flex justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Bank Accounts</p>
                        <p onClick={handleAddBank} title='Add Bank Accounts' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    <table className="w-full relative text-sm text-left text-gray-500 ">
                        <tbody>
                            {/* {accountData?.map((item: any) => */}
                            <tr onClick={handleClick} className="bg-white border-b cursor-default shadow-md hover:bg-gray-50 hover:text-gray-800">
                                <th title={'Bank Name'} className="px-4 truncate py-2">
                                    1
                                </th>
                                <th title={'Bank Name'} className="px-4 truncate py-2">
                                    State Bank Of India
                                </th>
                                <td title={'a'} className="px-4 truncate py-2">
                                    any
                                </td>
                            </tr>
                            {/* )} */}
                        </tbody>
                    </table>
                    <div className={` w-full bg-gray-100 h-10 flex justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Cards</p>
                        <p onClick={handleAddCard} title='Add Cards' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    <table className="w-full relative text-sm text-left text-gray-500 ">
                        <tbody>
                            {/* {accountData?.map((item: any) => */}
                            <tr onClick={handleClick} className="bg-white border-b cursor-default shadow-md hover:bg-gray-50 hover:text-gray-800">
                                <th title={'Bank Name'} className="px-4 truncate py-2">
                                    1
                                </th>
                                <th title={'Bank Name'} className="px-4 truncate py-2">
                                    State Bank Of India
                                </th>
                                <td title={'a'} className="px-4 truncate py-2">
                                    any
                                </td>
                            </tr>
                            {/* )} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BankAccounts;
