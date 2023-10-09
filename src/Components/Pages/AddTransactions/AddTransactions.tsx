import { Field, Form, Formik } from 'formik';
import { useState, type FC} from 'react';
import * as Yup from 'yup';
import {RxCross2} from 'react-icons/rx'

interface AddTransactionsProps { 
    openFotm:boolean
    setOpenForm:React.Dispatch<React.SetStateAction<boolean>>
}

const AddTransactions: FC<AddTransactionsProps> = ({openFotm,setOpenForm}) => {
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
        <div className={`w-full ${openFotm ? 'translate-y-0' : 'translate-y-full'} fixed z-40 top-0 transition-all duration-300 h-full`}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <Form className='w-full h-full bg-black bg-opacity-50 p-4 '>
                    <div className='w-full h-full flex flex-col items-center gap-8 justify-center'>
                        <div className='flex'>
                        <p onClick={()=>setOpenForm(false)} className='bg-blue-200 rounded-md p-2 text-blue-600 cursor-default font-bold'>Add Your Transactions Here!</p>
                        <div className='w-12 h-12 bg flex justify-center items-center'><RxCross2/></div>
                        </div>
                    
                        <div className={`w-[30rem] flex flex-col justify-around h-[20rem] rounded-md ${action === 'earning' ? 'bg-green-200' : action === 'expense' ? 'bg-red-200' : 'bg-white'} p-2 pt-4`}>
                       
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
