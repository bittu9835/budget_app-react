import { useState, type FC, useContext, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoAdd, IoClose } from 'react-icons/io5';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import Loader from '../../Common/Loader/Loader';
import chip from '../../../Assets/chip.png'
import moment from 'moment';

interface BankAccountsProps { }

const BankAccounts: FC<BankAccountsProps> = () => {
    const { render, setRender }: any = useContext(DataContext);
    const [openBankForm, setOpenBankForm] = useState(false)
    const [accountForEdit, setAccountForEdit] = useState(null)
    const [accountDetail, setAccountDetail] = useState<any>()
    const [cardDetail, setCardDetail] = useState<any>()
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

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

    // const handleClick = (_id: string) => {
    //     navigate(`/home/accountDetails/${_id}`)
    // }
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
                setIsLoading(false)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoadingButton(false)
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
                setIsLoading(false)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoadingButton(false)
        }
    }

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoadingButton(true)
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
                setIsLoadingButton(false)
                setRender(!render)
                setOpenBankForm(false);
                resetForm();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            // toast.error(error?.message);
            toast.warn(error?.response?.data?.message)
            setIsLoadingButton(false)
        }
    }

    useEffect(() => {
        FeatchAccountDetails()
        FeatchCardDetails()
    }, [render])
    return (
        <div className='w-full h-full relative'>
            <Loader isLoading={isLoading} />
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
                                {isLoadingButton ?
                                    <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                        <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                                    </div>
                                    :
                                    <button
                                        type='submit'
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
                    <div className='w-full overflow-y-auto scrollbar-thin  gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 p-2'>
                        {accountDetail?.map((item: any) =>
                            <div key={item?._id} className='h-auto flex flex-col items-center'>
                                <div className=" text-white p-2 bg-gradient-to-r from-[#713045] to-[#c94e4e] rounded-lg shadow-md w-full h-full">
                                    <div className="cursor-default flex flex-col justify-between">
                                        <div className='mb-2 flex sm:flex-row flex-col-reverse justify-between items-center'>
                                            <div className="">
                                                <p className="text-sm">Account Number</p>
                                                <p className="text-lg font-semibold">**** **** {item?.accountCardNumber}</p>
                                            </div>
                                            <p title='State Bank Of India' className='text-blue-900 font-extrabold truncate mr-1 text-xl'>
                                                {item?.bankCardName}
                                            </p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm">Account Holder</p>
                                            <p className="text-lg font-semibold">Bittu kumar</p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm">IFSC Code</p>
                                            <p className="text-lg font-semibold">{item?.ifcCode}</p>
                                            <p className='text-lg font-semibold text-gray-100 mt-2'>{item?.bankLocation}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 border-t cursor-default border-gray-300 pt-2 text-center">
                                        <p className="text-sm">A/C Balance</p>
                                        <p className="text-lg font-semibold">{item?.balance}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={` w-full bg-gray-100 h-10 flex justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Cards</p>
                        <p onClick={handleAddCard} title='Add Cards' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    <div className='w-full overflow-y-auto scrollbar-thin  gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 p-2'>
                        {cardDetail?.map((item: any) =>
                            <div key={item?._id} className='h-60 flex flex-col shadow-lg items-center'>
                                <div className="w-full cursor-default h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-4 relative shadow-md">
                                    <div className="absolute text-blue-800 font-extrabold bottom-2 text-xl right-2">
                                        {item?.serviveProvider}
                                    </div>
                                    <p title='State Bank Of India' className='text-blue-800 font-extrabold absolute top-2 right-2 '>
                                        {item?.bankCardName}
                                    </p>
                                    <div className="text-white text-2xl font-semibold absolute bottom-20 sm:tracking-widest sm:inset-x-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 left-5">
                                        **** **** **** {item?.accountCardNumber}
                                    </div>
                                    <div className="text-white tracking-widest text-md absolute font-medium bottom-5 left-4">
                                        Bittu Kumar
                                    </div>
                                    <div className="text-white text-base absolute font-medium bottom-12  inset-x-0 left-1/2 transform -translate-x-1/2">
                                        <span className='text-xs text-gray-900'>Valid Till</span> {moment(item?.expairyDate).format('MM/YY')}
                                    </div>
                                    <div className="absolute top-10 left-6">
                                        <img src={chip} alt="" className="w-10" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankAccounts;
