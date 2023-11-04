import { useState, type FC, useContext, useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';
import http from '../../../Services/http/http';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import Loader from '../../Common/Loader/Loader';
import chip from '../../../Assets/chip.png'
import fride from '../../../Assets/fride.png'
import moment from 'moment';
import bankStatement from '../../../Assets/bankStatment.png';
import cardStatement from '../../../Assets/cardStatment.png';
import { MdOutlineModeEditOutline } from 'react-icons/md'
import BankAccountForm from './BankAccountForm';

interface BankAccountsProps { }

const BankAccounts: FC<BankAccountsProps> = () => {
    const { render }: any = useContext(DataContext);
    const [openBankForm, setOpenBankForm] = useState(false)
    const [accountDetail, setAccountDetail] = useState<any | null>(null)
    const [cardDetail, setCardDetail] = useState<any | null>(null)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)



    const handleAddCard = () => {
        setType('card')
        setOpenBankForm(true)
    }

    const handleAddBank = () => {
        setType('bank')
        setOpenBankForm(true)
    }

    // const handleClick = (_id: string) => {
    //     navigate(`/home/accountDetails/${_id}`)
    // }


    const FeatchAccountDetails = async () => {
        try {
            const response: any = await http({
                url: `/account/gatAccount`,
                method: 'get',
            });

            if (response?.data?.code === 'SUCCESS_200') {
                setAccountDetail(response?.data?.data)
                setIsLoading(false)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoadingButton(false)
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
                setIsLoading(false)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            setIsLoadingButton(false)
        }
    }

    useEffect(() => {
        FeatchAccountDetails()
        FeatchCardDetails()
    }, [render])
    return (
        <div className='w-full h-full relative'>
            <Loader isLoading={isLoading} />
            <BankAccountForm type={type}
                openBankForm={openBankForm}
                isLoadingButton={isLoadingButton}
                setOpenBankForm={setOpenBankForm}
                setIsLoadingButton={setIsLoadingButton}
            />
            <div className="w-full h-full px-2 overflow-y-auto shadow-md">
                <div className='w-full bg-gray-50 mt-2 shadow-md rounded-t-md rounded-b-md'>
                    <div className={` w-full  h-10 flex justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Bank Accounts</p>
                        <p onClick={handleAddBank} title='Add Bank Accounts' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    {accountDetail?.length !== 0 ?
                        <div className='w-full overflow-y-auto scrollbar-thin gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 p-2'>
                            {accountDetail?.map((item: any) =>
                                <div key={item?._id} className='h-auto flex flex-col items-center group'>
                                    <div className=" text-white p-2 bg-gradient-to-r from-[#713045] to-[#c94e4e] rounded-lg shadow-md w-full h-full">
                                        <div className="cursor-default flex flex-col justify-between">
                                            <div className='mb-2 flex sm:flex-row flex-col-reverse justify-between items-center'>
                                                <div className="">
                                                    <p className="text-sm">Account Number</p>
                                                    <p className="text-lg font-semibold">**** **** {item?.accountCardNumber}</p>
                                                </div>
                                                <p title='State Bank Of India' className='text-blue-900 font-extrabold truncate mr-1 text-xl'>
                                                    {item?.bankCardName}
                                                </p>
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-sm">Account Holder</p>
                                                <p className="text-lg font-semibold">{item?.name}</p>
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-sm">IFSC Code</p>
                                                <p className="text-lg font-semibold">{item?.ifcCode}</p>
                                                <p className='text-lg font-semibold text-gray-100 mt-2'>{item?.bankLocation}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 border-t cursor-default border-gray-300 pt-2 text-center">
                                            <p className="text-sm">A/C Balance</p>
                                            <p className="text-lg font-semibold">{item?.balance}</p>
                                        </div>
                                    </div>
                                    <p className='group-hover:block hidden'>
                                        <MdOutlineModeEditOutline />
                                    </p>
                                </div>
                            )}
                        </div>
                        :
                        <div className='w-full h-[35vh] relative flex gap-2 items-start justify-center text-lg font-semibold text-gray-700'>
                            <img src={bankStatement} className=' w-28 h-28' alt="" />
                            <div className='absolute bottom-6'>
                                <p>Bank Accounts Not Found</p>
                                <p onClick={handleAddBank} className='text-base text-blue-800 cursor-pointer'>Add your First Bank Account</p>
                            </div>
                        </div>
                    }
                </div>
                <div className='w-full bg-gray-50 mt-2 rounded-t-md rounded-b-md shadow-md '>
                    <div className={` w-full  h-10 flex  justify-between px-2 items-center`}>
                        <p className='text-gray-700 text-lg'>Cards</p>
                        <p onClick={handleAddCard} title='Add Cards' className='p-2 cursor-pointer rounded-full hover:bg-gray-200'><IoAdd /></p>
                    </div>
                    {cardDetail?.length !== 0 ?
                        <div className='w-full overflow-y-auto scrollbar-thin  mb-2 gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 p-2'>
                            {cardDetail?.map((item: any) =>
                                <div key={item?._id} className='h-60 flex flex-col shadow-lg items-center'>
                                    <div className="w-full cursor-default h-full bg-gradient-to-r from-black to-[#1c1c1c] rounded-lg p-4 relative shadow-md">
                                        <div className="absolute text-white top-1 text-xs left-2">
                                        Platinum Debit Card
                                        </div>
                                        <div className="absolute text-gray-100 font-extrabold bottom-2 text-xl right-5">
                                            {item?.serviveProvider}
                                        </div>
                                        <p title='State Bank Of India' className='text-gray-100 font-extrabold absolute top-2 right-5 '>
                                            {item?.bankCardName}
                                        </p>
                                        <div className="text-gray-100 text-xl font-semibold absolute bottom-20 sm:tracking-widest left-10">
                                            **** **** **** {item?.accountCardNumber}
                                        </div>
                                        <div className="text-gray-100 tracking-widest text-md absolute font-medium bottom-5 left-10">
                                            {item?.name}
                                        </div>
                                        <div className="text-gray-100 text-base absolute font-medium left-10 bottom-14">
                                            <span className='text-xs text-gray-200'>Valid Thru</span> {moment(item?.expairyDate).format('MM/YY')}
                                        </div>
                                        <div className="absolute top-14 left-14">
                                            <img src={chip} alt="" className="w-10" />
                                        </div>
                                        <div className="absolute top-14 right-8">
                                            <img src={fride } alt="" className="w-12 " />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <div className='w-full h-[35vh] relative flex items-start justify-center text-lg font-semibold text-gray-700'>
                            <img src={cardStatement} className='w-60 h-36' alt="" />
                            <div className='absolute bottom-6'>
                                <p>Cards Not Found</p>
                                <p onClick={handleAddCard} className='text-base text-blue-800 cursor-pointer'>Add your First Cards</p>
                            </div>

                        </div>}
                </div>
            </div>
        </div>
    );
}

export default BankAccounts;
