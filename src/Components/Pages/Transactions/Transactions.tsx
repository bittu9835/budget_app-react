import type { FC } from 'react';
import Table from '../../Common/Table/Table';
import { motion } from 'framer-motion';

interface TransactionsProps {}

const Transactions: FC<TransactionsProps> = () => {
    return (
        <motion.div
        className='w-full h-full bg-gray-100 p-2'
        initial={{ opacity: 0, scale: 0 }} // Initial state (hidden and scaled down)
        animate={{ opacity: 1, scale: 1 }} // Animation state (visible and full size)
        transition={{ duration: 1 }} // Animation duration in seconds
      >
        
            <Table/>
      </motion.div>
    );
}

export default Transactions;
