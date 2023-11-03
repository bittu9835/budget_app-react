import { useEffect, type FC, useState } from 'react';
// import visa from '../../../../Assets/Visa_Inc._logo.svg.png'
import chip from '../../../../Assets/chip.png'
import http from '../../../../Services/http/http';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface AccountDetailsProps { }

const AccountDetails: FC<AccountDetailsProps> = () => {
    const [accountDetail, setAccountDetail] = useState<any>()
    const { Id } = useParams()
    const FeatchAccountDetails = async () => {
        try {
            const response: any = await http({
                url: `/account/gatOneAccountCard`,
                method: 'get',
                data: { '_id': Id }
            });

            if (response?.data?.code === 'SUCCESS_200') {
                setAccountDetail(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any | unknown) {
            toast.error(error?.message);
            // setIsLoading(false)
        }
    }

    useEffect(() => {
        FeatchAccountDetails()
        // eslint-disable-next-line 
    }, [])
    return (
        <div className='w-full h-full flex items-center justify-center relative'>
            {accountDetail?.type === 'card' &&
                <div className='w-full lg:w-3/5 md:w-4/5  md:px-1 px-4 flex h-48 md:h-60 flex-col shadow-lg items-center'>
                    <div className="w-full cursor-default h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-4 relative shadow-md">
                        <div className="absolute text-blue-800 font-extrabold top-4 left-4">
                            {/* <img src={visa} alt="" className="w-16" /> */}
                            {accountDetail?.serviveProvider}
                        </div>
                        <p title='State Bank Of India' className='text-blue-800 font-extrabold absolute top-2 right-2 text-xl'>
                            {accountDetail?.bankCardName}
                        </p>
                        <div className="text-white text-2xl font-semibold absolute bottom-20 left-4">
                            **** **** **** {accountDetail?.accountCardNumber}
                        </div>
                        <div className="text-white text-base absolute font-medium bottom-4 left-4">
                            Bittu Kumar
                        </div>
                        <div className="text-white text-base absolute font-medium bottom-12 left-4">
                        {accountDetail?.expairyDate}
                        </div>
                        <div className="absolute bottom-8 right-4">
                            <img src={chip} alt="" className="w-10" />
                        </div>
                    </div>
                </div>
   }
            {accountDetail?.type === 'bank' &&
                <div className='w-full lg:w-3/5 md:w-4/5  md:px-1 px-4 h-auto flex flex-col items-center'>
                    <div className="bg-white text-white p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg shadow-md w-full h-full">
                        <div className="cursor-default flex flex-col justify-between">
                            <div className='mb-2 flex sm:flex-row flex-col-reverse justify-between items-center'>
                                <div className="">
                                    <p className="text-sm">Account Number</p>
                                    <p className="text-lg font-semibold">**** **** {accountDetail?.accountCardNumber}</p>
                                </div>
                                <p title='State Bank Of India' className='text-blue-800 font-extrabold truncate mr-1 text-xl'>
                                {accountDetail?.bankCardName}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm">Account Holder</p>
                                <p className="text-lg font-semibold">Bittu kumar</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm">IFC Code</p>
                                <p className="text-lg font-semibold">{accountDetail?.ifcCode}</p>
                                <p className='text-lg font-semibold text-gray-700 mt-2'>{accountDetail?.bankLocation}</p>
                            </div>
                        </div>
                        <div className="mt-2 border-t cursor-default border-gray-300 pt-2 text-center">
                            <p className="text-sm">A/C Balance</p>
                            <p className="text-lg font-semibold">{accountDetail?.balance}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default AccountDetails;
