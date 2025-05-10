import { FC, useContext, useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { LuIndianRupee } from 'react-icons/lu';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import AddTransaction2 from './AddTransaction2';
// import Loader from '../../Common/Loader/Loader';

interface AddTransactionsProps {
    openFotm: boolean;
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AccountDetails {
    accountCardNumber: number
    balance?: number
    bankCardName: string
    bankLocation?: string
    expairyDate: Date | null
    ifcCode: string
    isActive: boolean
    name: string
    serviveProvider: string
    type: string
    _id: string
}

const AddTransactions: FC<AddTransactionsProps> = ({ openFotm, setOpenForm }) => {
    const { render, setRender, transactionForEdit, settransactionForEdit, setSelectedTransaction }: any = useContext(DataContext);
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [categoryIncome, setCategoryIncome] = useState<any>()
    const [categoryExpence, setCategoryExpence] = useState<any>()
    const [accountDetail, setAccountDetail] = useState<AccountDetails[] | null>(null)
    const [cardDetail, setCardDetail] = useState<AccountDetails[] | null>(null)
    // const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const paymentMethods = ['Cash', 'Account', 'Card'];

    const handleNavigateAccount = () => {
        setOpenForm(false)
        settransactionForEdit(null)
        navigate('/home/Card&Accounts')
    }

    const initialValues = {
        action: transactionForEdit !== null ? transactionForEdit.action : '',
        amount: transactionForEdit !== null ? transactionForEdit.amount : '',
        description: transactionForEdit !== null ? transactionForEdit.description : '',
        paymentMethod: transactionForEdit !== null ? transactionForEdit.paymentMethod : 'Cash',
        from: transactionForEdit !== null ? transactionForEdit.from : '',
        date: transactionForEdit !== null ? new Date(transactionForEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: transactionForEdit !== null ? transactionForEdit.category : '',
        newCategory: '',
    };

    const validationSchema = Yup.object().shape({
        action: Yup.string().required(),
        amount: Yup.number().required('Enter Amount,'),
        description: Yup.string().required('Add Description,').max(100, 'Description is Too Long,'),
        paymentMethod: Yup.string().required('Select Payment Method'),
        from: Yup.string().when('paymentMethod', ([paymentMethod]: any) => {
            return paymentMethod === 'Cash'
                ? Yup.string()
                : Yup.string().required('From is required');
        }),
        date: Yup.date(),
        category: Yup.string().required('Choose Category'),
        newCategory: Yup.string()
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        console.log(values,'values');
        if (transactionForEdit !== null) {
            setIsButtonLoading(true)
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
                    setIsButtonLoading(false)
                    setRender(!render)
                    setOpenForm(false)
                    resetForm();
                } else {
                    toast.error(response?.data?.message);
                }
            } catch (error: any | unknown) {
                toast.error(error?.message);
                setIsButtonLoading(false)
            }
        } else {
            setIsButtonLoading(true)
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
                    setIsButtonLoading(false)
                    setRender(!render)
                    setOpenForm(false)
                    resetForm();
                } else {
                    toast.error(response?.data?.message);
                }
            } catch (error: any | unknown) {
                toast.error(error?.message);
                setIsButtonLoading(false)
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
            setIsButtonLoading(false)
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
            setIsButtonLoading(false)
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
                setTimeout(() => {
                    // setIsLoading(false)
                }, 500)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            // setIsLoading(false)
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
                setTimeout(() => {
                    // setIsLoading(false)
                }, 500)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            // setIsLoading(false)
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
                                        id='income'
                                        name='action'
                                        value='income' />
                                    <label htmlFor="income">Income</label>
                                </div>
                                <div className='w-1/2 flex gap-2 '>
                                    <Field
                                        type="radio"
                                        id='expence'
                                        name='action'
                                        value='expence' />
                                    <label htmlFor="expence">Expence</label>
                                </div>
                            </div>
                            <div className='w-full flex sm:flex-row flex-col  items-center gap-10'>
                                <div className='w-full sm:w-1/2'>
                                    <label htmlFor="date">Choose a Date (MM/DD/YYYY)</label>
                                    <Field
                                        name="date"
                                        id="date"
                                        type='date'
                                        className='w-full border-b border-gray-700 font-semibold  bg-transparent outline-none'
                                    />
                                </div>

                                {values.category === 'addNewCategory' ?
                                    <div className='w-full sm:w-1/2'>
                                        <label htmlFor="newCategory">Enter Category Name</label>
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
                                            disabled={values.action === ''}
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
                                                    ''
                                            }
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
                            <AddTransaction2
                                paymentMethods={paymentMethods}
                                valuespaymentMethod={values.paymentMethod}
                                accountDetail={accountDetail}
                                handleNavigateAccount={handleNavigateAccount}
                                cardDetail={cardDetail}
                                isButtonLoading={isButtonLoading}
                                valuesaction={values.action}
                                transactionForEdit={transactionForEdit}
                                settransactionForEdit={settransactionForEdit}
                                setOpenForm={setOpenForm}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTransactions;
