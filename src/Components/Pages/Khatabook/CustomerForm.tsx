import type { FC } from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoClose } from 'react-icons/io5';
import { MdOutlinePersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { addCustomer, editCustomer } from '../../../Services/khatabookService';

interface CustomerFormProps {
    onClose: () => void;
    onSuccess: () => void;
    customerForEdit?: { _id: string; name: string; phone: string; address?: string } | null;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
    address: Yup.string(),
});

const CustomerForm: FC<CustomerFormProps> = ({ onClose, onSuccess, customerForEdit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = customerForEdit != null;

    const initialValues = {
        name: isEditing ? customerForEdit!.name : '',
        phone: isEditing ? customerForEdit!.phone : '',
        address: isEditing ? (customerForEdit!.address || '') : '',
    };

    const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
        setIsLoading(true);
        try {
            if (isEditing) {
                await editCustomer(customerForEdit!._id, values);
                toast.success('Customer updated');
            } else {
                await addCustomer(values);
                toast.success('Customer added');
            }
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
                    <Form className='w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 pb-8 relative shadow-2xl'
                        style={{ background: 'var(--color-form-bg)' }}>

                        {/* Drag handle (mobile) */}
                        <div className='sm:hidden w-10 h-1 rounded-full bg-gray-400 mx-auto mb-5 opacity-40' />

                        {/* Header */}
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-10 h-10 rounded-2xl flex items-center justify-center text-white'
                                style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}>
                                <MdOutlinePersonAdd className='text-xl' />
                            </div>
                            <div className='flex-1'>
                                <h2 className='font-extrabold text-base' style={{ color: 'var(--color-form-text)' }}>
                                    {isEditing ? 'Edit Customer' : 'Add Customer'}
                                </h2>
                                <p className='text-xs opacity-40' style={{ color: 'var(--color-form-text)' }}>
                                    {isEditing ? 'Update customer details' : 'Enter customer details below'}
                                </p>
                            </div>
                            <button type='button' onClick={onClose}
                                className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition-all'
                                style={{ color: 'var(--color-form-text)' }}>
                                <IoClose className='text-lg' />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className='flex flex-col gap-4'>
                            {/* Name */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Full Name *
                                </label>
                                <Field name='name' type='text' placeholder='e.g. Bittu Singh'
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                                        ${touched.name && errors.name ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                                <ErrorMessage name='name' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Phone */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Phone Number *
                                </label>
                                <Field name='phone' type='tel' placeholder='10-digit number'
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                                        ${touched.phone && errors.phone ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                                <ErrorMessage name='phone' render={msg =>
                                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                                } />
                            </div>

                            {/* Address */}
                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                                    style={{ color: 'var(--color-form-label-text)' }}>
                                    Address <span className='normal-case font-normal'>(optional)</span>
                                </label>
                                <Field name='address' type='text' placeholder='Street, City...'
                                    className='w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 border-transparent focus:border-[#5200bb] transition-all'
                                    style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='flex gap-3 mt-6'>
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
                                <div className='flex-1 py-3 rounded-xl flex items-center justify-center'
                                    style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}>
                                    <div className='w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin' />
                                </div>
                            ) : (
                                <button type='submit'
                                    className='flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]'
                                    style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}>
                                    {isEditing ? 'Update Customer' : 'Add Customer'}
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CustomerForm;
