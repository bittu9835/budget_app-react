import type { FC } from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { addLedgerEntry } from '../../../Services/khatabookService';

interface LedgerFormProps {
    customerId: string;
    type: 'credit' | 'debit';
    onClose: () => void;
    onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
    amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .typeError('Enter a valid number'),
    note: Yup.string().max(100, 'Note is too long'),
    date: Yup.date(),
});

const LedgerForm: FC<LedgerFormProps> = ({ customerId, type, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isCredit = type === 'credit';

    const gradient = isCredit
        ? 'linear-gradient(135deg,#b91c1c,#ef4444)'
        : 'linear-gradient(135deg,#15803d,#22c55e)';
    const focusBorder = isCredit ? 'focus:border-red-500' : 'focus:border-green-500';
    const amountColor = isCredit ? '#dc2626' : '#16a34a';

    const initialValues = {
        amount: '',
        note:   '',
        date:   new Date().toISOString().split('T')[0],
    };

    const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
        setIsLoading(true);
        try {
            await addLedgerEntry(customerId, type, Number(values.amount), values.note, values.date);
            toast.success(`${isCredit ? 'You Gave' : 'You Got'} entry added`);
            resetForm();
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched }) => (
                    <Form className='w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl pb-8 relative shadow-2xl overflow-hidden'
                        style={{ background: 'var(--color-form-bg)' }}>

                        {/* Gradient top bar */}
                        <div className='h-1 w-full' style={{ background: gradient }} />

                        <div className='px-6 pt-5'>
                            {/* Drag handle (mobile) */}
                            <div className='sm:hidden w-10 h-1 rounded-full bg-gray-400 mx-auto mb-4 opacity-40' />

                            {/* Header */}
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md'
                                    style={{ background: gradient }}>
                                    {isCredit
                                        ? <TbArrowBigUpFilled className='text-xl' />
                                        : <TbArrowBigDownFilled className='text-xl' />
                                    }
                                </div>
                                <div className='flex-1'>
                                    <h2 className='font-extrabold text-base' style={{ color: 'var(--color-form-text)' }}>
                                        {isCredit ? 'YOU GAVE' : 'YOU GOT'}
                                    </h2>
                                    <p className='text-xs opacity-40' style={{ color: 'var(--color-form-text)' }}>
                                        {isCredit ? 'Money you gave' : 'Money you received'}
                                    </p>
                                </div>
                                <button type='button' onClick={onClose}
                                    className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition-all'
                                    style={{ color: 'var(--color-form-text)' }}>
                                    <IoClose className='text-lg' />
                                </button>
                            </div>

                            {/* Amount — big prominent input */}
                            <div className='flex flex-col gap-1 mb-4'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Amount (₹) *
                                </label>
                                <div className='flex items-center gap-2 rounded-2xl px-4 py-3 border-2 transition-all'
                                    style={{
                                        background: 'var(--color-bg-outlet)',
                                        borderColor: touched.amount && errors.amount ? '#ef4444' : amountColor
                                    }}>
                                    <span className='text-2xl font-black' style={{ color: amountColor }}>₹</span>
                                    <Field name='amount' type='number' min='0' placeholder='0'
                                        className='flex-1 bg-transparent outline-none text-2xl font-black'
                                        style={{ color: amountColor }}
                                    />
                                </div>
                                <ErrorMessage name='amount' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Note */}
                            <div className='flex flex-col gap-1 mb-4'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Note <span className='normal-case font-normal'>(optional)</span>
                                </label>
                                <Field name='note' type='text' placeholder='Add a note...'
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 border-transparent transition-all ${focusBorder}`}
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                                <ErrorMessage name='note' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Date */}
                            <div className='flex flex-col gap-1 mb-6'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Date
                                </label>
                                <Field name='date' type='date'
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 border-transparent transition-all ${focusBorder}`}
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                            </div>

                            {/* Actions */}
                            <div className='flex gap-3'>
                                <button type='button' onClick={onClose}
                                    className='flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all hover:opacity-80'
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-form-text)',
                                        background: 'transparent'
                                    }}>
                                    Cancel
                                </button>
                                {isLoading ? (
                                    <div className='flex-1 py-3 rounded-xl flex items-center justify-center shadow-md'
                                        style={{ background: gradient }}>
                                        <div className='w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin' />
                                    </div>
                                ) : (
                                    <button type='submit'
                                        className='flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:scale-[1.02]'
                                        style={{ background: gradient }}>
                                        {isCredit ? 'YOU GAVE' : 'YOU GOT'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LedgerForm;
