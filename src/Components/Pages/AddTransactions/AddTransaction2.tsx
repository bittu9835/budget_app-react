import { Field, ErrorMessage } from 'formik';
import type { FC } from 'react';

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

interface AddTransaction2Props {
    paymentMethods: any
    valuespaymentMethod: string
    accountDetail: AccountDetails[] | null
    cardDetail: AccountDetails[] | null
    handleNavigateAccount: any
    isButtonLoading: boolean
    valuesaction: string
    transactionForEdit: any
    settransactionForEdit: React.Dispatch<React.SetStateAction<any>>
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
    touched: any
    errors: any
}

const AddTransaction2: FC<AddTransaction2Props> = ({
    paymentMethods,
    valuespaymentMethod,
    accountDetail,
    handleNavigateAccount,
    cardDetail,
    isButtonLoading,
    valuesaction,
    transactionForEdit,
    settransactionForEdit,
    setOpenForm,
    touched,
    errors,
}) => {
    const showAccountSelect = valuespaymentMethod === 'Account' && accountDetail && accountDetail.length > 0;
    const showCardSelect = valuespaymentMethod === 'Card' && cardDetail && cardDetail.length > 0;
    const showEmptyAccount = valuespaymentMethod === 'Account' && accountDetail?.length === 0;
    const showEmptyCard = valuespaymentMethod === 'Card' && cardDetail?.length === 0;

    return (
        <>
            {/* Payment Method */}
            <div className='flex flex-col gap-1'>
                <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                    style={{ color: 'var(--color-form-label-text)' }}>
                    Payment Mode *
                </label>
                <div className='flex gap-2'>
                    {paymentMethods.map((method: string) => (
                        <Field key={method} name='paymentMethod'>
                            {({ field, form }: any) => (
                                <button
                                    type='button'
                                    onClick={() => form.setFieldValue('paymentMethod', method)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all
                                        ${field.value === method
                                            ? 'border-[#5200bb] text-[#5200bb]'
                                            : 'border-transparent'}`}
                                    style={field.value !== method
                                        ? { background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }
                                        : { background: '#f3e8ff' }}
                                >
                                    {method}
                                </button>
                            )}
                        </Field>
                    ))}
                </div>
                <ErrorMessage name='paymentMethod' render={msg =>
                    <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                } />
            </div>

            {/* Account selector */}
            {showEmptyAccount && (
                <p className='text-sm text-center'>
                    No accounts found.{' '}
                    <span onClick={handleNavigateAccount} className='text-[#5200bb] font-bold cursor-pointer underline'>
                        Add Account
                    </span>
                </p>
            )}
            {showAccountSelect && (
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                        style={{ color: 'var(--color-form-label-text)' }}>
                        Select Account *
                    </label>
                    <Field
                        id='from'
                        name='from'
                        as='select'
                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                            ${touched.from && errors.from ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                        style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                    >
                        <option value=''>Choose account…</option>
                        {accountDetail?.map((item) => (
                            <option key={item._id} value={item.accountCardNumber}>
                                **{item.accountCardNumber}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name='from' render={msg =>
                        <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                    } />
                </div>
            )}

            {/* Card selector */}
            {showEmptyCard && (
                <p className='text-sm text-center'>
                    No cards found.{' '}
                    <span onClick={handleNavigateAccount} className='text-[#5200bb] font-bold cursor-pointer underline'>
                        Add Card
                    </span>
                </p>
            )}
            {showCardSelect && (
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] font-black uppercase tracking-widest opacity-50'
                        style={{ color: 'var(--color-form-label-text)' }}>
                        Select Card *
                    </label>
                    <Field
                        id='from'
                        name='from'
                        as='select'
                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none border-2 transition-all
                            ${touched.from && errors.from ? 'border-red-400' : 'border-transparent focus:border-[#5200bb]'}`}
                        style={{ background: 'var(--color-bg-outlet)', color: 'var(--color-form-text)' }}
                    >
                        <option value=''>Choose card…</option>
                        {cardDetail?.map((item) => (
                            <option key={item._id} value={item.accountCardNumber}>
                                **{item.accountCardNumber}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name='from' render={msg =>
                        <p className='text-red-500 text-[11px] mt-0.5 pl-1'>{msg}</p>
                    } />
                </div>
            )}

            {/* Action buttons */}
            <div className='flex gap-3 mt-2'>
                <button
                    type='button'
                    onClick={() => { setOpenForm(false); settransactionForEdit(null); }}
                    className='flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all hover:opacity-80'
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-form-text)', background: 'transparent' }}
                >
                    Cancel
                </button>
                {isButtonLoading ? (
                    <div
                        className='flex-1 py-3 rounded-xl flex items-center justify-center'
                        style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
                    >
                        <div className='w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin' />
                    </div>
                ) : (
                    <button
                        type='submit'
                        disabled={valuesaction !== 'income' && valuesaction !== 'expence'}
                        className='flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
                    >
                        {transactionForEdit !== null ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                )}
            </div>
        </>
    );
};

export default AddTransaction2;
