import { FC, useContext, useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { LuIndianRupee } from 'react-icons/lu';
import { MdSwapVert } from 'react-icons/md';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import AddTransaction2 from './AddTransaction2';
import {
    addTransaction as addTransactionService,
    editTransaction as editTransactionService,
    getAllCategoriesFromDB,
    syncCategoriesFromServer,
    getAllAccountsFromDB,
    CategoryOption,
} from '../../../Services/transactionService';

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
    const [categoryIncome, setCategoryIncome] = useState<CategoryOption[]>([])
    const [categoryExpence, setCategoryExpence] = useState<CategoryOption[]>([])
    const [accountDetail, setAccountDetail] = useState<AccountDetails[] | null>(null)
    const [cardDetail, setCardDetail] = useState<AccountDetails[] | null>(null)

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
        action: Yup.string().required('Select Income or Expense'),
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
        newCategory: Yup.string().when('category', ([category]: any) =>
            category === 'addNewCategory'
                ? Yup.string().required('Enter a category name').min(1, 'Category name cannot be empty')
                : Yup.string()
        )
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsButtonLoading(true);
        try {
            if (transactionForEdit !== null) {
                const editId = transactionForEdit?.id || transactionForEdit?._id;
                await editTransactionService(editId, values);
                toast.success('Transaction updated successfully');
                settransactionForEdit(null);
                setSelectedTransaction([]);
            } else {
                await addTransactionService(values);
                toast.success('Transaction added successfully');
            }
            setIsButtonLoading(false);
            setRender(!render);
            setOpenForm(false);
            resetForm();
        } catch (error: any) {
            console.error('Transaction submit failed:', error);
            setIsButtonLoading(false);
        }
    };

    const loadCategories = async () => {
        const serverData = await syncCategoriesFromServer();
        const serverHasData = serverData && (serverData.income.length > 0 || serverData.expence.length > 0);

        if (!serverHasData) {
            // Server returned empty or request failed — fall back to IndexedDB
            const [income, expence] = await Promise.all([
                getAllCategoriesFromDB('income'),
                getAllCategoriesFromDB('expence'),
            ]);
            setCategoryIncome(income);
            setCategoryExpence(expence);
        } else {
            const toOption = (cat: any): CategoryOption => ({ category: cat.category, action: cat.action });
            setCategoryIncome(serverData.income.map(toOption).sort((a, b) => a.category.localeCompare(b.category)));
            setCategoryExpence(serverData.expence.map(toOption).sort((a, b) => a.category.localeCompare(b.category)));
        }
    };

    const loadAccountsAndCards = async () => {
        try {
            const [accounts, cards] = await Promise.all([
                getAllAccountsFromDB('bank'),
                getAllAccountsFromDB('card'),
            ]);
            setAccountDetail(accounts as any);
            setCardDetail(cards as any);
        } catch (error) {
            console.error('Failed to load accounts/cards:', error);
        }
    };

    useEffect(() => {
        loadCategories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        loadAccountsAndCards();
        // eslint-disable-next-line
    }, [render]);
    if (!openFotm) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ values, setFieldValue, errors, touched }) => (
                    <Form
                        className='w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl p-6 pb-8 relative shadow-2xl overflow-y-auto max-h-[95dvh] scrollbar-none'
                        style={{ background: 'var(--color-form-bg)' }}
                    >
                        {/* Drag handle (mobile) */}
                        <div className='sm:hidden w-10 h-1 rounded-full bg-gray-400 mx-auto mb-5 opacity-40' />

                        {/* Header */}
                        <div className='flex items-center gap-3 mb-6'>
                            <div
                                className='w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0'
                                style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
                            >
                                <MdSwapVert className='text-xl' />
                            </div>
                            <div className='flex-1'>
                                <h2 className='font-extrabold text-base' style={{ color: 'var(--color-form-text)' }}>
                                    {transactionForEdit !== null ? 'Edit Transaction' : 'New Transaction'}
                                </h2>
                                <p className='text-xs opacity-40' style={{ color: 'var(--color-form-text)' }}>
                                    {transactionForEdit !== null ? 'Update the transaction details' : 'Fill in the details below'}
                                </p>
                            </div>
                            <button
                                type='button'
                                onClick={() => { setOpenForm(false); settransactionForEdit(null); }}
                                className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition-all'
                                style={{ color: 'var(--color-form-text)' }}
                            >
                                <IoClose className='text-lg' />
                            </button>
                        </div>

                        <div className='flex flex-col gap-4'>

                            {/* Income / Expense toggle */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Type *
                                </label>
                                <div className='flex gap-3'>
                                    {['income', 'expence'].map((type) => (
                                        <button
                                            key={type}
                                            type='button'
                                            onClick={() => setFieldValue('action', type)}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all capitalize
                                                ${values.action === type
                                                    ? type === 'income'
                                                        ? 'border-green-500 text-green-600 bg-green-50'
                                                        : 'border-red-400 text-red-500 bg-red-50'
                                                    : 'border-transparent'
                                                }`}
                                            style={values.action !== type ? { background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' } : {}}
                                        >
                                            {type === 'expence' ? 'Expense' : 'Income'}
                                        </button>
                                    ))}
                                </div>
                                <ErrorMessage name='action' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Amount + Date row */}
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-1 flex-1'>
                                    <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                        style={{ color: 'var(--color-form-label-text)' }}>
                                        Amount *
                                    </label>
                                    <div className='relative'>
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm
                                            ${values.action === 'income' ? 'text-green-500' : values.action === 'expence' ? 'text-red-500' : 'opacity-40'}`}
                                            style={values.action === '' ? { color: 'var(--color-form-text)' } : {}}>
                                            <LuIndianRupee />
                                        </span>
                                        <Field
                                            name='amount'
                                            id='amount'
                                            type='number'
                                            placeholder='0'
                                            className={`w-full rounded-xl pl-8 pr-4 py-3 text-sm font-semibold outline-none border-2 transition-all appearance-none
                                                ${touched.amount && errors.amount ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}
                                                ${values.action === 'income' ? 'text-green-600' : values.action === 'expence' ? 'text-red-500' : ''}`}
                                            style={{ background: 'var(--color-bg-outlet)', color: values.action === '' ? 'var(--color-form-text)' : undefined }}
                                        />
                                    </div>
                                    <ErrorMessage name='amount' render={msg =>
                                        <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                    } />
                                </div>

                                <div className='flex flex-col gap-1 flex-1'>
                                    <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                        style={{ color: 'var(--color-form-label-text)' }}>
                                        Date
                                    </label>
                                    <Field
                                        name='date'
                                        id='date'
                                        type='date'
                                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 border-transparent focus:border-[#5200bb] transition-all`}
                                        style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Category *
                                </label>
                                {values.category === 'addNewCategory' ? (
                                    <>
                                        <Field
                                            autoFocus
                                            id='newCategory'
                                            name='newCategory'
                                            type='text'
                                            placeholder='Enter new category name'
                                            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                                                ${touched.newCategory && errors.newCategory ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                                            style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                        />
                                        <ErrorMessage name='newCategory' render={msg =>
                                            <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                        } />
                                    </>
                                ) : (
                                    <Field
                                        id='category'
                                        name='category'
                                        as='select'
                                        disabled={values.action === ''}
                                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                                            ${touched.category && errors.category ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                                        style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                    >
                                        <option value=''>Select category…</option>
                                        {values.action === 'income'
                                            ? categoryIncome.map((cat) => <option key={cat.category} value={cat.category}>{cat.category}</option>)
                                            : values.action === 'expence'
                                                ? categoryExpence.map((cat) => <option key={cat.category} value={cat.category}>{cat.category}</option>)
                                                : null}
                                        <option value='addNewCategory'>+ Add New Category</option>
                                    </Field>
                                )}
                                <ErrorMessage name='category' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Description */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Description *
                                </label>
                                <Field
                                    name='description'
                                    id='description'
                                    type='text'
                                    placeholder='What was this for?'
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                                        ${touched.description && errors.description ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                                <ErrorMessage name='description' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Payment method + account/card */}
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
                                touched={touched}
                                errors={errors}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTransactions;
