import { useState, type FC, useContext, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoAdd, IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';

interface BankAccountsProps { }

const BankAccounts: FC<BankAccountsProps> = () => {
    const { render, setRender }: any = useContext(DataContext);
    const [openBankForm, setOpenBankForm] = useState(false)
    const [accountForEdit, setAccountForEdit] = useState(null)
    const [accountDetail, setAccountDetail] = useState<any>()
    const [cardDetail, setCardDetail] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [type, setType] = useState<string | null>(null)
    const navigate = useNavigate()

    const initialValues = {
        accountCardNumber: '',
        bankCardName: '',
        bankLocation: '',
        ifcCode: '',
        expairyDate: '',
        serviveProvider: '',
    }

    const validationSchema = Yup.object().shape({
        accountCardNumber: Yup.string().matches(/^[0-9]{4}$/, 'Number Must Bee 4 Digits.').required('Enter No.'),
        bankCardName: Yup.string().required('Enter Name').max(50, 'Too Long'),
        bankLocation: Yup.string().max(30, 'Too Long'),
        ifcCode: Yup.string().matches(/^[0-9A-Za-z]{11}$/, 'Incorrect IFC Code'),
        expairyDate: Yup.date(),
        serviveProvider: Yup.string().max(20, 'Too Long'),
    });

    const handleAddCard = () => {
        setType('card')
        setOpenBankForm(true)
    }

    const handleAddBank = () => {
        setType('bank')
        setOpenBankForm(true)
    }

    const handleClick = (_id:string) => {
        navigate(`/home/accountDetails/${_id}`)
    }
    const handleCancle = () => {
        setOpenBankForm(false);
        setAccountForEdit(null);
    }

    const FeatchAccountDetails = async () => {
        try {
            const response: any = await http({
                url: `/account/gatAccount`,
                method: 'get',
            });
           
            if (response?.data?.code === 'SUCCESS_200') {
                setAccountDetail(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoading(false)
        }
    }
    const FeatchCardDetails = async () => {
        try {
            const response: any = await http({
                url: `/account/gatCard`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setCardDetail(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoading(false)
        }
    }

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true)
        values['type'] = type
        try {
            const response: any = await http({
                url: `/account/createAccount`,
                method: 'post',
                data: values
            });
             console.log(response)
            if (response?.data?.code === 'SUCCESS_200') {
                toast.success(response?.data?.message);
                setIsLoading(false)
                setRender(!render)
                setOpenBankForm(false);
                resetForm();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            // toast.error(error?.message);
            toast.warn(error?.response?.data?.message)
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        FeatchAccountDetails()
        FeatchCardDetails()
    },[render])
    return (
        <div className='w-full h-full relative'>
            <div className={`w-full h-full ${openBankForm ? 'block' : 'hidden'} absolute z-40 top-0 bg-black bg-opacity-90  transition-all duration-300 flex items-center justify-center`}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    <Form className='sm:w-[33rem] bg-white w-full h-full sm:h-auto overflow-y-auto scrollbar-none rounded-sm p-6'>
                        <div className='flex items-center justify-between mb-5'>
                            <p className='text-lg'>{accountForEdit !== null ? 'Edit' : 'Add '}{type === 'card' ? 'Card' : type === 'bank' ? 'Bank Account' : 'Account & Card'} </p>
                            <p onClick={handleCancle} className='p-2 text-lg flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer'><IoClose /></p>
                        </div>
                        <div>
                            <span className='text-xs text-red-500'><ErrorMessage name='bankCardName' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='accountCardNumber' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='ifcCode' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='bankLocation' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='serviveProvider' /></span>
                        </div>
                        <div className='px-5 w-full flex text-sm text-gray-800 sm:mt-2 mt-10 flex-col gap-10 '>
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div title={type === 'card' ? 'Enter Card Name' : type === 'bank' ? 'Enter Bank Name' : 'Enter Bank & Card Name'} className='w-full sm:w-1/2'>
                                    <label htmlFor="bankCardName">{type === 'card' ? 'Card Name' : type === 'bank' ? 'Bank Name' : 'Bank & Card Name'}</label>
                                    <Field
                                        className={` text-sm outline-none bg-transparent border-b border-gray-700 font-semibold  w-full appearance-none`}
                                        type='string'
                                        name='bankCardName'
                                        id='bankCardName'
                                        placeholder='State Bank Of India'
                                    />
                                </div>
                                <div title={type === 'card' ? 'Enter Last 4 Digit of Card No.' : type === 'bank' ? 'Enter Last 4 Digit of A/C No.' : 'Enter Last 4 Digit of A/C & Card No.'} className='w-full sm:w-1/2'>
                                    <label htmlFor="accountCardNumber">{type === 'card' ? 'Last 4 Digit of Card No.' : type === 'bank' ? 'Last 4 Digit of A/C No.' : 'Last 4 Digit of A/C & Card No.'}</label>
                                    <Field
                                        className='w-full border-b border-gray-700 font-semibold  appearance-none outline-none bg-transparent'
                                        type='number'
                                        name='accountCardNumber'
                                        id='accountCardNumber'
                                        placeholder='4826'
                                    />
                                </div>
                            </div>
                            {type === 'bank' &&
                                <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                    <div title='Enter IFC Code' className='w-full sm:w-1/2'>
                                        <label htmlFor="ifcCode">IFC Code</label>
                                        <Field
                                            className={` text-sm outline-none bg-transparent appearance-none uppercase-input border-b border-gray-700 font-semibold  w-full`}
                                            type='string'
                                            name='ifcCode'
                                            id='ifcCode'
                                            placeholder='SBIN0012560'
                                        />
                                    </div>
                                    <div title='Enter Bank Location' className='w-full sm:w-1/2'>
                                        <label htmlFor="bankLocation">Bank location</label>
                                        <Field
                                            className='w-full border-b border-gray-700 font-semibold  appearance-none outline-none bg-transparent'
                                            type='string'
                                            name='bankLocation'
                                            id='bankLocation'
                                            placeholder='New Delhi'
                                        />
                                    </div>
                                </div>
                            }
                            {type === 'card' &&
                                <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                    <div title='Enter IFC Code' className='w-full sm:w-1/2'>
                                        <label htmlFor="expairyDate">Expairy Date</label>
                                        <Field
                                            className={` text-sm outline-none bg-transparent appearance-none uppercase-input border-b border-gray-700 font-semibold  w-full`}
                                            type='date'
                                            name='expairyDate'
                                            id='expairyDate'
                                        />
                                    </div>
                                    <div title='Enter Bank Location' className='w-full sm:w-1/2'>
                                        <label htmlFor="serviveProvider">Service Provider</label>
                                        <Field
                                            className='w-full border-b border-gray-700 font-semibold  appearance-none outline-none bg-transparent'
                                            type='string'
                                            name='serviveProvider'
                                            id='serviveProvider'
                                            placeholder='VISA'
                                        />
                                    </div>
                                </div>
                            }
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
                                <div onClick={handleCancle} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                            </div>
                        </div>
                    </Form>
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
                            {accountDetail?.map((item: any,index:number) =>
                            <tr onClick={()=>handleClick(item._id)} key={item._id} className="bg-white border-b cursor-default shadow-md hover:bg-gray-50 hover:text-gray-800">
                                <th className="px-4 truncate py-2">
                                    {index+1}
                                </th>
                                <th title= {item?.bankCardName} className="px-4 truncate py-2">
                                    {item?.bankCardName}
                                </th>
                                <td title={item?.accountCardNumber} className="px-4 truncate py-2">
                                **{item?.accountCardNumber}
                                </td>
                            </tr>
                             )}
                        </tbody>
                    </table>
                    <div className={` w-full bg-gray-100 h-10 flex justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Cards</p>
                        <p onClick={handleAddCard} title='Add Cards' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    <table className="w-full relative text-sm text-left text-gray-500 ">
                        <tbody>
                            {cardDetail?.map((item: any,index:number) =>
                            <tr key={item._id} onClick={()=>handleClick(item._id)} className="bg-white border-b cursor-default shadow-md hover:bg-gray-50 hover:text-gray-800">
                                <th className="px-4 truncate py-2">
                                    {index+1}
                                </th>
                                <th title={item?.bankCardName} className="px-4 truncate py-2">
                                {item?.bankCardName} ({item?.serviveProvider})
                                </th>
                                <td title={item?.accountCardNumber} className="px-4 truncate py-2">
                                **{item?.accountCardNumber}
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BankAccounts;
