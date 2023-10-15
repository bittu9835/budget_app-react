import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState, FC } from 'react';
import * as Yup from 'yup';
import { RxCross2 } from 'react-icons/rx';

interface AddTransactionsProps {
    openFotm: boolean;
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTransactions: FC<AddTransactionsProps> = ({ openFotm, setOpenForm }) => {
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
    const accounts = [
        {
            id: 1,
            name: 'ac1',
        },
        {
            id: 2,
            name: 'ac2',
        },
        {
            id: 3,
            name: 'ac3',
        },
    ];
    const cards = [
        {
            id: 1,
            name: 'c1',
        },
        {
            id: 2,
            name: 'c2',
        },
        {
            id: 3,
            name: 'c3',
        },
    ];
    const [action, setAction] = useState('');
    const initialValues = {
        amount: 100,
        description: '',
        paymentMethod: '',
        from: 'Cash',
    };

    const validationSchema = Yup.object().shape({
        amount: Yup.number().required(),
        description: Yup.string(),
        paymentMethod: Yup.string().required(),
        from: Yup.string().required(),
    });

    const handleSubmit = (values: any) => {
        values['drcr'] = action
        if (values.paymentMethod === 'Cash') {
            values['from'] = 'Cash';
        }
        console.log(values);
    };

    return (
        <div className={`w-full ${openFotm ? 'translate-y-0' : 'translate-y-full'} fixed z-40 top-0 transition-all duration-300 h-full`}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ values, setFieldValue }) => (
                    <Form className='w-full h-full bg-black bg-opacity-70 p-4 '>
                        <div className='w-full h-full flex flex-col items-center gap-8 justify-center'>
                            <p className='bg-blue-200 rounded-md p-2 text-blue-600 cursor-default font-bold flex justify-between md:w-[25rem] w-full items-center'>
                                <span>Add Your Transactions Here!</span>
                                <span title='Exit' onClick={() => setOpenForm(!openFotm)} className='text-lg cursor-pointer'>
                                    <RxCross2 />
                                </span>
                            </p>
                            <div className='bg-blue-200 rounded-md p-2'>
                                <span className="text-red-500 text-sm"><ErrorMessage name='amount' /></span>
                                <span className="text-red-500 text-sm"><ErrorMessage name='paymentMethod' /></span>
                                <span className="text-red-500 text-sm"><ErrorMessage name='from' /></span>
                                <span className="text-red-500 text-sm"><ErrorMessage name='action' /></span>
                            </div>
                            <div className={`md:w-[25rem] w-full flex flex-col justify-around md:h-[20rem] h-full rounded-md ${action === 'earning' ? 'bg-green-200' : action === 'expense' ? 'bg-red-200' : 'bg-white'} p-2 pt-4`}>

                                <div title='Choose one of these' className='w-full flex justify-between px-2'>
                                    <div onClick={() => setAction('earning')} className={`cursor-pointer px-3 py-1 rounded-md ${action === 'earning' ? 'bg-green-600' : 'bg-gray-500 '}`}>
                                        + Earning
                                    </div>
                                    <div onClick={() => setAction('expense')} className={`cursor-pointer px-3 py-1 rounded-md ${action === 'expense' ? 'bg-red-600' : 'bg-gray-500 '}`}>
                                        - Expense
                                    </div>
                                </div>
                                <div className={`  ${action === 'earning' ? 'block' : action === 'expense' ? 'block' : 'hidden'} rounded-md mx-auto max-w-sm mt-4`}>
                                    <Field
                                        id='paymentMethod'
                                        name='paymentMethod'
                                        className={`w-full bg-transparent py-2 px-4  focus:outline-none rounded-md`}
                                        as='select'
                                    >
                                        <option value="">Select Payment Method</option>
                                        {paymentMethods.map((item: any) => (
                                            <option key={item.id} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                <div className={` ${action === 'earning' ? 'block' : action === 'expense' ? 'block' : 'hidden'} rounded-md mx-auto max-w-sm`}>
                                    {values.paymentMethod !== 'Cash' &&
                                        <Field
                                            id='from'
                                            name='from'
                                            className={`w-full bg-transparent py-2 px-4  focus:outline-none rounded-md`}
                                            as='select'

                                        >
                                            <option value="">{action === 'earning' ? 'To' : action === 'expense' ? 'From' : ''}</option>
                                            {
                                                values.paymentMethod === 'Account'
                                                    ?
                                                    accounts.map((item: any) => (
                                                        <option key={item.id} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))
                                                    :
                                                    values.paymentMethod === 'Card'
                                                        ? cards.map((item: any) => (
                                                            <option key={item.id} value={item.name}>
                                                                {item.name}
                                                            </option>
                                                        ))
                                                        : null}
                                        </Field> }
                                </div>
                                <div className='w-full'>
                                    <div title='Enter Amount' className='mx-auto max-w-sm'>
                                        <Field
                                            className={`${action === 'earning' ? 'text-green-700' : action === 'expense' ? 'text-red-700' : 'text-gray-700'} outline-none bg-transparent text-5xl font-bold w-full py-2 px-4 text-center rounded-lg appearance-none`}
                                            type='number'
                                            name='amount'
                                            id='amount'
                                        />
                                    </div>
                                    <div title='Enter Description' className='mx-auto max-w-sm mt-4'>
                                        <Field
                                            className='text-gray-700 w-full py-2 px-4 text-center rounded-lg appearance-none outline-none bg-transparent font-bold placeholder:text-gray-500'
                                            type='text'
                                            name='description'
                                            id='description'
                                            placeholder='Add Description'
                                        />
                                    </div>
                                </div>
                                <button
                                    type='submit'
                                    disabled={action === 'earning' || action === 'expense' ? false : true}
                                    className={`${action === 'earning' || action === 'expense' ? 'bg-[#5200bb]' : 'bg-gray-800'} w-full py-2  text-white font-extrabold rounded-lg`}
                                >
                                    Add Transaction
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTransactions;
