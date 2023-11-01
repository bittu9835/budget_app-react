import type { FC } from 'react';

interface InvestmentProps {}

const Investment: FC<InvestmentProps> = () => {
    return (
        <div className='bg-white flex w-full h-full items-center justify-center'>
            <p className='text-7xl font-bold text-purple-950 animate-bounce'>Comming Soon</p>
        </div>
    );
}

export default Investment;
