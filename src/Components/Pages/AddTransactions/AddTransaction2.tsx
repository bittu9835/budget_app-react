import { Field } from 'formik';
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
    paymentMethods: any,
    valuespaymentMethod: string
    accountDetail: AccountDetails[] | null
    cardDetail: AccountDetails[] | null
    handleNavigateAccount: any
    isButtonLoading: boolean
    valuesaction: string
    transactionForEdit: AccountDetails[] | null
    settransactionForEdit: React.Dispatch<React.SetStateAction<AccountDetails[] | null>>
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
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
}) => {
    return (
        <>
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
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </Field>
                </div>
                {valuespaymentMethod === 'Account' ?
                    accountDetail?.length === 0
                        ?
                        <span onClick={handleNavigateAccount} className='text-blue-700 cursor-pointer text-lg font-serif'>Click To Add {valuespaymentMethod}</span>
                        :
                        <div className='w-full sm:w-1/2'>
                            <label htmlFor="from">Select {valuespaymentMethod}</label>
                            <Field
                                id='from'
                                name='from'
                                className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                as='select'

                            >
                                <option value=''></option>
                                {accountDetail?.map((item: any) => (
                                    <option key={item._id} value={item?.accountCardNumber}>
                                        **{item?.accountCardNumber}
                                    </option>
                                ))}
                            </Field>
                        </div> : ''}
                {valuespaymentMethod === 'Card' ?
                    cardDetail?.length === 0
                        ?
                        <span onClick={handleNavigateAccount} className='text-blue-700 cursor-pointer text-lg font-serif'>Click To Add {valuespaymentMethod}</span>
                        :
                        <div className='w-full sm:w-1/2'>
                            <label htmlFor="from">Select {valuespaymentMethod}</label>
                            <Field
                                id='from'
                                name='from'
                                className={`w-full border-b border-gray-700 font-semibold  bg-transparent focus:outline-none`}
                                as='select'

                            >
                                <option value=''></option>
                                {cardDetail?.map((item: any) => (
                                    <option key={item._id} value={item?.accountCardNumber}>
                                        **{item?.accountCardNumber}
                                    </option>
                                ))}
                            </Field>
                        </div> : ''}
            </div>

            {valuespaymentMethod === 'Account' ?
                accountDetail?.length === 0
                    ?
                    ''
                    :
                    <div className='2 flex gap-5 font-medium justify-end mt-5'>
                        {isButtonLoading ?
                            <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                            </div>
                            :
                            <button
                                type='submit'
                                disabled={valuesaction === 'income' || valuesaction === 'expence' ? false : true}
                                className={`${valuesaction === 'income' || valuesaction === 'expence' ? 'bg-[#5200bb]' : 'bg-gray-800'} py-[2px] px-4   text-white  rounded-sm`}>
                                {transactionForEdit !== null ? 'Update' : 'Add'}
                            </button>
                        }
                        <div onClick={() => {
                            setOpenForm(false)
                            settransactionForEdit(null)
                        }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                    </div> : ''}
            {valuespaymentMethod === 'Card' ?
                cardDetail?.length === 0
                    ?
                    ''
                    :
                    <div className='2 flex gap-5 font-medium justify-end mt-5'>
                        {isButtonLoading ?
                            <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                                <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                            </div>
                            :
                            <button
                                type='submit'
                                disabled={valuesaction === 'income' || valuesaction === 'expence' ? false : true}
                                className={`${valuesaction === 'income' || valuesaction === 'expence' ? 'bg-[#5200bb]' : 'bg-gray-800'} py-[2px] px-4   text-white  rounded-sm`}>
                                {transactionForEdit !== null ? 'Update' : 'Add'}
                            </button>
                        }
                        <div onClick={() => {
                            setOpenForm(false)
                            settransactionForEdit(null)
                        }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                    </div> : ''}
            {valuespaymentMethod === 'Cash' ?
                <div className='2 flex gap-5 font-medium justify-end mt-5'>
                    {isButtonLoading ?
                        <div className='py-[2px] px-5 flex items-center justify-center  border-[#5200bb] border  rounded-sm'>
                            <div className="w-4 h-4  border-t-2  border-r-0 border-b-0 border-red-500 border-solid rounded-full animate-spin"></div>
                        </div>
                        :
                        <button
                            type='submit'
                            disabled={valuesaction === 'income' || valuesaction === 'expence' ? false : true}
                            className={`${valuesaction === 'income' || valuesaction === 'expence' ? 'bg-[#5200bb]' : 'bg-gray-800'} py-[2px] px-4   text-white  rounded-sm`}>
                            {transactionForEdit !== null ? 'Update' : 'Add'}
                        </button>
                    }
                    <div onClick={() => {
                        setOpenForm(false)
                        settransactionForEdit(null)
                    }} className='py-[2px] px-2  cursor-pointer hover:bg-[#4e2682] border-[#5200bb] border text-black hover:text-white rounded-sm'>Cancle</div>
                </div> : ''}
        </>
    );
}

export default AddTransaction2;
