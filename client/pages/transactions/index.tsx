import TransactionRow from './components/TransactionRow';
import EmptyState from './components/EmptyState';
import BodyWrap from '../../components/BodyWrap';
import Loader from '../../components/Loader';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';

import { DecoratedTx } from '../types';
import { useEffect, useState } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState<DecoratedTx[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    const getTransactions = async () => {
      const token = await getFromStorage('token');

      if (token) {
        setIsLoading(true);

        const transRes = await getWithToken('wallet/transactions', token);

        setIsLoading(false);
        setTransactions(transRes.data.data);
      }
    };

    getTransactions();
  }, []);
  
  return (
    <>
      <BodyWrap>
        {!isLoading ? (
        <div className="min-h-full">
          <main className="flex-1">
            <div className="">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Transactions
                </h1>
                <div className="py-4">
                  {transactions.length ? (
                    <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0 bg-white rounded-b-md shadow">
                      {transactions.map((transaction) => (
                        <TransactionRow
                          key={transaction.txid}
                          transaction={transaction}
                        />
                      ))}
                    </ul>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>) : <Loader />}

      </BodyWrap>
    </>
  );
}