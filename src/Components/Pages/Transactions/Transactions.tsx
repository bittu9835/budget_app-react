import { useState, type FC } from 'react';
import Table from '../../Common/Table/Table';
import Loader from '../../Common/Loader/Loader';

interface TransactionsProps { }

const Transactions: FC<TransactionsProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <div className='w-full h-full bg-gray-100 p-2 relative'>
      <Loader isLoading={isLoading} />
      <Table setIsLoading={setIsLoading} />
    </div>
  );
}

export default Transactions;
