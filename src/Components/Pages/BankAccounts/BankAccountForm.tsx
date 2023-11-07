import { useContext, type FC } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import http from '../../../Services/http/http';
import { DataContext } from '../../../Context/DataProvider';


interface BankAccountFormProps {
    openBankForm: boolean
    isLoadingButton: boolean
    type: string | null
    setOpenBankForm: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoadingButton: React.Dispatch<React.SetStateAction<boolean>>
}

const BankAccountForm: FC<BankAccountFormProps> = ({ isLoadingButton, type, openBankForm, setOpenBankForm, setIsLoadingButton }) => {
    const { setRender, accountForEdit, setAccountForEdit,render }: any = useContext(DataContext);

    const handleCancle = () => {
        setAccountForEdit(null);
        setOpenBankForm(false);
    }

    const initialValues = {
        accountCardNumber: accountForEdit?.accountCardNumber ?? '',
        bankCardName: accountForEdit?.bankCardName ?? '',
        bankLocation: accountForEdit?.bankLocation ?? '',
        ifcCode: accountForEdit?.ifcCode ?? '',
        expairyDate: accountForEdit?.expairyDate ?? '',
        serviveProvider: accountForEdit?.serviveProvider ?? '',
        name: accountForEdit?.name ?? '',
    };


    const validationSchema = Yup.object().shape({
        accountCardNumber: Yup.string().matches(/^[0-9]{4}$/, 'Number Must Bee 4 Digits,').required('Enter No,'),
        bankCardName: Yup.string().required('Enter Bank Name,').max(50, 'Bank Name is Too Long,'),
        bankLocation: Yup.string().max(30, 'Bank Location is Too Long,'),
        ifcCode: Yup.string().matches(/^[0-9A-Za-z]{11}$/, 'Incorrect IFSC Code,'),
        expairyDate: Yup.date(),
        serviveProvider: Yup.string().max(20, 'serviveProvider Too Long,'),
        name: Yup.string().required('Enter Your Name,').max(20, 'Your Name is Too Long,'),
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        if (accountForEdit === null) {
            setIsLoadingButton(true)
            values['type'] = type
            try {
                const response: any = await http({
                    url: `/account/createAccount`,
                    method: 'post',
                    data: values
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    setRender(!render)
                    toast.success(response?.data?.message);
                    setIsLoadingButton(false)
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
        } else {
            setIsLoadingButton(true)
            values['type'] = type
            values['_id'] = accountForEdit?._id
            try {
                const response: any = await http({
                    url: `/account/editAccountCard`,
                    method: 'put',
                    data: values
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    setRender(!render)
                    toast.success(response?.data?.message);
                    setIsLoadingButton(false)
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

    }
    return (
        <div className={`w-full h-full ${openBankForm ? 'block' : 'hidden'} absolute z-40 top-0 bg-black bg-opacity-90  transition-all duration-300 flex items-center justify-center`}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <Form className='sm:w-[33rem] bg-white w-full h-full sm:h-auto overflow-y-auto scrollbar-none rounded-sm p-6'>
                    <div className='flex items-center justify-between mb-5'>
                        <p className='text-lg'>{accountForEdit !== null ? 'Edit' : 'Add '} {type === 'card' ? 'Card' : type === 'bank' ? 'Bank Account' : 'Account & Card'} </p>
                        <p onClick={handleCancle} className='p-2 text-lg flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer'><IoClose /></p>
                    </div>
                    <div className='h-3'>
                        <span className='text-xs text-red-500'><ErrorMessage name='bankCardName' /></span>
                        <span className='text-xs text-red-500'><ErrorMessage name='accountCardNumber' /></span>
                        <span className='text-xs text-red-500'><ErrorMessage name='ifcCode' /></span>
                        <span className='text-xs text-red-500'><ErrorMessage name='bankLocation' /></span>
                        <span className='text-xs text-red-500'><ErrorMessage name='serviveProvider' /></span>
                        <span className='text-xs text-red-500'><ErrorMessage name='name' /></span>
                    </div>
                    <div className='px-5 w-full flex text-sm text-gray-800 sm:mt-2 mt-10 flex-col gap-10 '>
                        <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                            <div title={type === 'card' ? 'Enter Card Name' : type === 'bank' ? 'Enter Bank Name' : 'Enter Bank & Card Name'} className='w-full sm:w-1/2'>
                                <label htmlFor="bankCardName">{type === 'card' ? 'Card Provider Name' : type === 'bank' ? 'Bank Name' : 'Bank & Card Name'}</label>
                                <Field
                                    className={` text-sm outline-none bg-transparent border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  w-full appearance-none`}
                                    type='string'
                                    name='bankCardName'
                                    id='bankCardName'
                                    placeholder='As:- State Bank Of India'
                                />
                            </div>
                            <div title={type === 'card' ? 'Enter Last 4 Digit of Card No.' : type === 'bank' ? 'Enter Last 4 Digit of A/C No.' : 'Enter Last 4 Digit of A/C & Card No.'} className='w-full sm:w-1/2'>
                                <label htmlFor="accountCardNumber">{type === 'card' ? 'Last 4 Digit of Card No.' : type === 'bank' ? 'Last 4 Digit of A/C No.' : 'Last 4 Digit of A/C & Card No.'}</label>
                                <Field
                                    className='w-full border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  appearance-none outline-none bg-transparent'
                                    type='number'
                                    name='accountCardNumber'
                                    id='accountCardNumber'
                                    placeholder='As:- 4826'
                                />
                            </div>
                        </div>
                        {type === 'bank' &&
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div title='Enter IFC Code' className='w-full sm:w-1/2'>
                                    <label htmlFor="ifcCode">IFC Code</label>
                                    <Field
                                        className={` text-sm outline-none bg-transparent appearance-none uppercase-input border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  w-full`}
                                        type='string'
                                        name='ifcCode'
                                        id='ifcCode'
                                        placeholder='As:- SBIN0012560'
                                    />
                                </div>
                                <div title='Enter Bank Location' className='w-full sm:w-1/2'>
                                    <label htmlFor="bankLocation">Bank location</label>
                                    <Field
                                        className='w-full border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  appearance-none outline-none bg-transparent'
                                        type='string'
                                        name='bankLocation'
                                        id='bankLocation'
                                        placeholder='As:- New Delhi'
                                    />
                                </div>
                            </div>
                        }
                        {type === 'card' &&
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div title='Enter IFC Code' className='w-full sm:w-1/2'>
                                    <label htmlFor="expairyDate">Expairy Date</label>
                                    <Field
                                        className={` text-sm outline-none bg-transparent appearance-none uppercase-input border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  w-full`}
                                        type='date'
                                        name='expairyDate'
                                        id='expairyDate'
                                    />
                                </div>
                                <div title='Enter Bank Location' className='w-full sm:w-1/2'>
                                    <label htmlFor="serviveProvider">Service Provider</label>
                                    <Field
                                        className='w-full border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  appearance-none outline-none bg-transparent'
                                        type='string'
                                        name='serviveProvider'
                                        id='serviveProvider'
                                        placeholder='As:- VISA'
                                    />
                                </div>
                            </div>
                        }
                        <div title='Enter Name On your ' className='w-full'>
                            <label htmlFor="name">{type === 'card' ? 'Enter Your Name On Your Card' : type === 'bank' ? 'Enter Your Name On Your Bank' : 'Enter Your Name'}</label>
                            <Field
                                className='w-full border-b border-gray-700 placeholder:font-light text-gray-600 font-semibold  appearance-none outline-none bg-transparent'
                                type='string'
                                name='name'
                                id='name'
                                placeholder='As:- Bittu Kumar Singh'
                            />
                        </div>
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
    );
}

export default BankAccountForm;
