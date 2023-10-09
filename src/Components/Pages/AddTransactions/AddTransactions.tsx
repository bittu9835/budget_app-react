import { Field, Form, Formik } from 'formik';
import { useState, type FC} from 'react';
import * as Yup from 'yup';

interface AddTransactionsProps { }

const AddTransactions: FC<AddTransactionsProps> = () => {
    const [action, setAction] = useState('');
    const initialValues = {
        amount: 100,
        description: ''
    };

    const validationSchema = Yup.object().shape({
        amount: Yup.number().required(),
        description: Yup.string()
    });

    const handleSubmit = () => {

    }

    
    return (
        <div className='w-full h-full bg-white'>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <Form className='w-full h-full bg-gray-100 rounded-lg p-4'>
                    <p className='text-blue-600 h-[5%] cursor-default font-bold'>Add Your Transactions Here!</p>
                    <div className='w-full h-[95%] flex flex-col items-center justify-center'>
                        <div className={`w-[30rem] flex flex-col justify-around h-[30rem] rounded-md ${action === 'earning' ? 'bg-green-200' : action === 'expense' ? 'bg-red-200' : 'bg-white'} p-2 pt-4`}>
                            <div className='w-full flex justify-around'>
                                <div onClick={() => setAction('earning')} className={`cursor-pointer px-3 py-1 rounded-md ${action === 'earning' ? 'bg-green-600' : 'bg-gray-500 '} `}>Earning</div>
                                <div onClick={() => setAction('expense')} className={`cursor-pointer px-3 py-1 rounded-md ${action === 'expense' ? 'bg-red-600' : 'bg-gray-500 '} `}>Expense</div>
                            </div>
                            <div className='w-full'>
                            <div className='mx-auto max-w-sm'>
                                <Field className={`${action === 'earning' ? 'text-green-700' : action === 'expense' ? 'text-red-700' : 'text-gray-700'} outline-none bg-transparent text-5xl font-bold w-full py-2 px-4 text-center rounded-lg appearance-none`} type="number" name='amount' id='amount' />
                            </div>
                            <div className='mx-auto max-w-sm mt-4'>
                                <Field className='text-gray-700 w-full py-2 px-4 text-center rounded-lg appearance-none outline-none bg-transparent font-bold placeholder:text-gray-500' type="text" name='description' id='description' placeholder='Add Description' />
                            </div>
                            </div>
                            <button className='w-full py-2 bg-[#5200bb] text-white font-extrabold rounded-lg'>Add Transaction</button>
                         </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}

export default AddTransactions;
