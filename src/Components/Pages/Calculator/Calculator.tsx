import type { FC } from 'react';

interface CalculatorProps { }

const Calculator: FC<CalculatorProps> = () => {
    return (
        <div className='bg-white flex w-full h-full items-center justify-center'>
            <p className='text-7xl font-bold text-purple-950 animate-bounce'>Comming Soon</p>
        </div>
    );
}

export default Calculator;
