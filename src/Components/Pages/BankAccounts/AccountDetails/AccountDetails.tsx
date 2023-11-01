import type { FC } from 'react';
import visa from '../../../../Assets/Visa_Inc._logo.svg.png'
import chip from '../../../../Assets/chip.png'

interface AccountDetailsProps {}

const AccountDetails: FC<AccountDetailsProps> = () => {
    return (
        <div className='w-full h-full relative'>
                <div className='w-full h-full py-5 flex sm:justify-evenly px-7 sm:flex-row md:gap-4 gap-12 flex-col'>
                <div className='w-full lg:w-80 md:w-52 flex flex-col items-center'>
                    <div className="w-full cursor-default h-48 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-4 relative shadow-md">
                        <div className="absolute top-4 left-4">
                            <img src={visa} alt="" className="w-16" />
                        </div>
                        <p title='State Bank Of India' className='text-blue-800 font-extrabold absolute top-2 right-2 text-xl'>SBI</p>
                        <div className="text-white text-2xl font-semibold absolute bottom-20 left-4">
                            **** **** **** 3456
                        </div>
                        <div className="text-white text-base absolute font-medium bottom-7 left-4">
                            Bittu Kumar
                        </div>
                        <div className="absolute bottom-8 right-4">
                            <img src={chip} alt="" className="w-10" />
                        </div>
                    </div>
                    {/* <div onClick={handleAddCard} className='mt-4'>
                        <p className='text-[#5200bb] cursor-pointer font-semibold'>Add Cards (+)</p>
                    </div> */}
                </div>
                <div className='w-full lg:w-80 md:w-52 flex flex-col items-center'>
                    <div className="bg-white px-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg shadow-md w-full   h-48">
                        <div className="cursor-default">
                            <div className='mb-2 flex justify-between items-center'>
                            <div className="">
                                <label className="text-sm text-white">Account Number</label>
                                <p className="text-lg text-white font-semibold">**** **** 3456</p>
                            </div>
                            <p title='State Bank Of India' className='text-blue-800 font-extrabold mr-1 text-xl'>SBI</p>
                            </div>
                            <div className="mb-2">
                                <label className="text-sm text-white">Account Holder</label>
                                <p className="text-lg text-white font-semibold">Bittu kumar</p>
                            </div>
                        </div>
                        <div className="mt-2 border-t cursor-default border-gray-300 pt-2 text-center">
                            <p className="text-sm text-white">A/C Balance</p>
                            <p className="text-lg font-semibold text-white">₹ 500.00</p>
                        </div>
                    </div>
                    {/* <div onClick={handleAddBank} className='mt-4'>
                        <p className='text-[#5200bb] cursor-pointer font-semibold'>Add Accounts (+)</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
