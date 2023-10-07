import type { FC } from 'react';
import {BiRupee} from 'react-icons/bi'
import {FiArrowUpRight} from 'react-icons/fi'
// import {FiArrowDownRight} from 'react-icons/fi'
interface CardProps { 
    title?:string;
    amount?:number;
    indicator?:string
}

const Card: FC<CardProps> = ({title,amount,indicator}) => {
    return (
        <div className='w-full h-full flex flex-col gap-2 bg-transparent rounded-xl p-2'>
            <p className='text-lg font-semibold text-gray-800'>{title}</p>
            <div className='flex items-center font-bold gap-1 text-4xl text-gray-900'>
                <span><BiRupee/></span>
                <span>{amount}</span>
            </div>
            <div className='text-green-500 flex items-center gap-2'>
                <span className='p-[2px] rounded-full text-white bg-green-500'><FiArrowUpRight/></span>
                <span className='text-sm font-bold'>{indicator}</span>
            </div>
        </div>
    );
}

export default Card;
