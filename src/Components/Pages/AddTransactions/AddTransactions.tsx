import { FC, useContext, useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { LuIndianRupee } from 'react-icons/lu';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';

interface AddTransactionsProps {
    openFotm: boolean;
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTransactions: FC<AddTransactionsProps> = ({ openFotm, setOpenForm }) => {
    const { render, setRender, transactionForEdit, settransactionForEdit, setSelectedTransaction }: any = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false)
    const [categoryIncome, setCategoryIncome] = useState<any>()
    const [categoryExpence, setCategoryExpence] = useState<any>()
    const [accountDetail, setAccountDetail] = useState<any>()
    const [cardDetail, setCardDetail] = useState<any>()
    const navigate = useNavigate()
    // const [paymentMode,setPaymentMode]=useState('')
    const paymentMethods = [
        {
            id: 1,
            name: 'Cash',
        },
        {
            id: 2,
            name: 'Account',
        },
        {
            id: 3,
            name: 'Card',
        },
    ];

    const initialValues = {
        action: transactionForEdit !== null ? transactionForEdit.action : '',
        amount: transactionForEdit !== null ? transactionForEdit.amount : '',
        description: transactionForEdit !== null ? transactionForEdit.description : '',
        paymentMethod: transactionForEdit !== null ? transactionForEdit.paymentMethod : 'Cash',
        from: transactionForEdit !== null ? transactionForEdit.from : 'Cash',
        date: transactionForEdit !== null ? new Date(transactionForEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: transactionForEdit !== null ? transactionForEdit.category : '',
        newCategory: '',
    };

    const validationSchema = Yup.object().shape({
        action: Yup.string().required(),
        amount: Yup.number().required('Enter Amount,'),
        description: Yup.string().required('Add Description,').max(100, 'Description is Too Long,'),
        paymentMethod: Yup.string().required('Sellect Payment Method'),
        from: Yup.string().required('Choose payment from'),
        date: Yup.date(),
        category: Yup.string().required('Choose Category'),
        newCategory: Yup.string()
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        if (transactionForEdit !== null) {
            setIsLoading(true)
            if (values.paymentMethod === 'Cash') {
                values['from'] = 'Cash';
            }
            if (values.category === 'addNewCategory') {
                values['category'] = values.newCategory;
            }
            values['_id'] = transactionForEdit?._id

            try {
                const response: any = await http({
                    url: `/transaction/editTransactions`,
                    method: 'put',
                    data: values
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    toast.success(response?.data?.message);
                    settransactionForEdit(null)
                    setSelectedTransaction([])
                    setIsLoading(false)
                    setRender(!render)
                    setOpenForm(false)
                    resetForm();
                } else {
                    toast.error(response?.data?.message);
                }
            } catch (error: any | unknown) {
                toast.error(error?.message);
                setIsLoading(false)
            }
        } else {
            setIsLoading(true)

            if (values.paymentMethod === 'Cash') {
                values['from'] = 'Cash';
            }
            if (values.category === 'addNewCategory') {
                values['category'] = values.newCategory;
            }
            try {
                const response: any = await http({
                    url: `/transaction/addTransaction`,
                    method: 'post',
                    data: values
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    toast.success(response?.data?.message);
                    setIsLoading(false)
                    setRender(!render)
                    setOpenForm(false)
                    resetForm();
                } else {
                    toast.error(response?.data?.message);
                }
            } catch (error: any | unknown) {
                toast.error(error?.message);
                setIsLoading(false)
            }
        }
    };


    const FeatchIncomeCategory = async () => {
        try {
            const response: any = await http({
                url: `/category/getIncomeCategory`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setCategoryIncome(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoading(false)
        }
    }
    const FeatchExpenceCategory = async () => {
        try {
            const response: any = await http({
                url: `/category/getExpenceCategory`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setCategoryExpence(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoading(false)
        }
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
    useEffect(() => {
        FeatchIncomeCategory()
        FeatchExpenceCategory()
    }, [])

    useEffect(() => {
        FeatchCardDetails()
        FeatchAccountDetails()
    }, [render])

    return (
        <div className={`w-full h-full ${openFotm ? 'translate-y-0' : 'translate-y-full'} fixed z-40 top-0 bg-black bg-opacity-70  transition-all duration-300 flex items-center justify-center`}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ values, setFieldValue }) => (
                    <Form className={` sm:w-[33rem] w-full overflow-y-auto scrollbar-none h-full sm:h-auto bg-skin-bg-form-bg rounded-sm p-6`}>
                        <div className='flex items-center justify-between mb-5'>
                            <p className='text-lg'>{transactionForEdit !== null ? 'Edit' : 'New'} Transaction</p>
                            <p onClick={() => {
                                setOpenForm(false)
                                settransactionForEdit(null)
                            }} className='p-2 text-lg flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer'><IoClose /></p>
                        </div>
                        <div className='h-3'>
                            <span className='text-xs text-red-500'><ErrorMessage name='action' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='amount' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='description' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='paymentMethod' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='from' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='category' /></span>
                            <span className='text-xs text-red-500'><ErrorMessage name='newCategory' /></span>
                        </div>
                        <div className='px-5 w-full flex text-sm text-gray-800 sm:mt-2 mt-10 flex-col gap-10 '>
                            <div className='w-full flex gap-10 justify-around'>
                                <div className='w-1/2 flex gap-2'>
                                    <Field
                                        type="radio"
                                        id='action'
                                        name='action'
                                        value='income' />
                                    <label htmlFor="action">Income</label>
                                </div>
                                <div className='w-1/2 flex gap-2 '>
                                    <Field
                                        type="radio"
                                        id='action'
                                        name='action'
                                        value='expence' />
                                    <label htmlFor="action">Expence</label>
                                </div>
                            </div>
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div className='w-full sm:w-1/2'>
                                    <label htmlFor="date">Choose a Date (MM/DD/YYYY)</label>
                                    <Field
                                        name="date"
                                        type='date'
                                        className='w-full border-b border-gray-700 font-semibold  bg-transparent outline-none'
                                    />
                                </div>

                                {values.category === 'addNewCategory' ?
                                    <div className='w-full sm:w-1/2'>
                                        <label htmlFor="from">Enter Category Name</label>
                                        <Field
                                            autoFocus={true}
                                            id='newCategory'
                                            name='newCategory'
                                            className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                            type='text'
                                        >
                                        </Field>
                                    </div>
                                    :
                                    <div className='w-full sm:w-1/2'>
                                        <label htmlFor="category">Select Category</label>
                                        <Field
                                            id='category'
                                            name='category'
                                            className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                            as='select'
                                        >
                                            <option value=''></option>
                                            {values.action === 'income' ?
                                                categoryIncome?.map((item: any) => (
                                                    <option key={item._id} value={item.category}>
                                                        {item.category}
                                                    </option>
                                                ))
                                                :
                                                values.action === 'expence' ?
                                                    categoryExpence?.map((item: any) => (
                                                        <option key={item._id} value={item.category}>
                                                            {item.category}
                                                        </option>
                                                    ))
                                                    :
                                                    ''}
                                            <option value='addNewCategory'>Add Category</option>
                                        </Field>
                                    </div>}

                            </div>
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div title='Enter Amount' className='w-full sm:w-1/2 relative'>
                                    <label htmlFor="amount">Enter Amount</label>
                                    <Field
                                        className={`pl-5 text-sm ${values.action === 'income' ? 'text-green-500' : values.action === 'expence' ? 'text-red-500' : ''} outline-none bg-transparent border-b border-gray-700 font-semibold  w-full appearance-none`}
                                        type='number'
                                        name='amount'
                                        id='amount'
                                    />
                                    <span className={`absolute left-0 ${values.action === 'income' ? 'text-green-500' : values.action === 'expence' ? 'text-red-500' : ''}`}><LuIndianRupee /></span>
                                </div>
                                <div title='Enter Description' className='w-full sm:w-1/2'>
                                    <label htmlFor="description">Add Description</label>
                                    <Field
                                        className='w-full border-b border-gray-700 font-semibold  appearance-none outline-none bg-transparent'
                                        type='text'
                                        name='description'
                                        id='description'
                                    />
                                </div>
                            </div>
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div className='w-full sm:w-1/2'>
                                    <label htmlFor="paymentMethod">Select Payment Mode</label>
                                    <Field
                                        id='paymentMethod'
                                        name='paymentMethod'
                                        className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                        as='select'
                                    >
                                        <option value=''></option>
                                        {paymentMethods.map((item: any) => (
                                            <option key={item.id} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                {values.paymentMethod !== 'Cash' &&
                                    <>
                                        {cardDetail?.length === 0
                                            ?
                                            <span onClick={() => navigate('/home/Card&Accounts')} className='text-blue-700 cursor-pointer text-lg font-serif'>Click To Add {values.paymentMethod === 'Account' ? 'Account' : values.paymentMethod === 'Card' ? 'Card' : ''}</span>
                                            :
                                            cardDetail?.length === 0
                                                ?
                                                <span onClick={() => navigate('/home/Card&Accounts')} className='text-blue-700 cursor-pointer font-serif'>Add {values.paymentMethod === 'Account' ? 'Account' : values.paymentMethod === 'Card' ? 'Card' : ''}</span>
                                                :

                                                <div className='w-full sm:w-1/2'>
                                                    <label htmlFor="from">Select {values.paymentMethod === 'Account' ? 'Account' : values.paymentMethod === 'Card' ? 'Card' : ''}</label>
                                                    <Field
                                                        id='from'
                                                        name='from'
                                                        className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                                        as='select'

                                                    >
                                                        <option value=''></option>
                                                        {values.paymentMethod === 'Account'
                                                            ?

                                                            accountDetail?.map((item: any) => (
                                                                <option key={item._id} value={item?.accountCardNumber}>
                                                                    **{item?.accountCardNumber}
                                                                </option>
                                                            ))
                                                            :
                                                            values.paymentMethod === 'Card'
                                                                ? cardDetail?.map((item: any) => (
                                                                    <option key={item._id} value={item?.accountCardNumber}>
                                                                        **{item?.accountCardNumber}
                                                                    </option>
                                                                ))
                                                                :
                                                                null}
                                                    </Field>
                                                </div>
                                        }
                                    </>}
                            </div>
                            {values.paymentMethod === 'Cash' &&
                                <>
                                    <div className='flex gap-5 font-medium justify-end mt-5'>
                                        {isLoading ?
                                            <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                                <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                                            </div>
                                            :
                                            <button
                                                type='submit'
                                                disabled={values.action === 'income' || values.action === 'expence' ? false : true}
                                                className={`${values.action === 'income' || values.action === 'expence' ? 'bg-[#5200bb]' : 'bg-gray-800'} py-[2px] px-4   text-white  rounded-sm`}>
                                                {transactionForEdit !== null ? 'Update' : 'Add'}
                                            </button>
                                        }
                                        <div onClick={() => {
                                            setOpenForm(false)
                                            settransactionForEdit(null)
                                        }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                                    </div>
                                    {cardDetail?.length === 0
                                        ?
                                        ''
                                        :
                                        cardDetail?.length === 0
                                            ?
                                            ''
                                            :
                                            <div className='flex gap-5 font-medium justify-end mt-5'>
                                                {isLoading ?
                                                    <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                                        <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                                                    </div>
                                                    :
                                                    <button
                                                        type='submit'
                                                        disabled={values.action === 'income' || values.action === 'expence' ? false : true}
                                                        className={`${values.action === 'income' || values.action === 'expence' ? 'bg-[#5200bb]' : 'bg-gray-800'} py-[2px] px-4   text-white  rounded-sm`}>
                                                        {transactionForEdit !== null ? 'Update' : 'Add'}
                                                    </button>
                                                }
                                                <div onClick={() => {
                                                    setOpenForm(false)
                                                    settransactionForEdit(null)
                                                }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                                            </div>
                                    }
                                </>}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTransactions;
