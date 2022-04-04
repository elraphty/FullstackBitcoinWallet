import TransactionRow from './components/TransactionRow';
import EmptyState from './components/EmptyState';
import BodyWrap from '../../components/BodyWrap';
import Loader from '../../components/Loader';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';

import { DecoratedTx } from '../types';
import { useEffect, useState, useCallback } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState<DecoratedTx[]>([]);
  const [addressType, setAddressType] = useState<string>('p2wpkh');
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const getTransactions = useCallback(async () => {
    const token = await getFromStorage('token');

    if (token) {
      setIsLoading(true);

      const transRes = await getWithToken(`wallet/transactions?type=${addressType}`, token);

      setIsLoading(false);
      setTransactions(transRes.data.data);
    }
  }, [addressType]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const switchAddressType = useCallback((_type: string) => {
    setAddressType(_type);
    getTransactions();
  }, [getTransactions]);

  return (
    <BodyWrap>
      {!isLoading ? (
        <div className="min-h-full">
          <main className="flex-1">
            <div className="">
              <div className="max-w-7xl mx-auto">
                <h1 className="sm:text-xl xs:text-sm lg:text-2xl font-semibold text-gray-900">
                  Transactions
                </h1>
                <section className="mt-3 mb-2">
                  <button className={`inline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  ${addressType === 'p2wpkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`}
                    onClick={() => switchAddressType('p2wpkh')
                    }>
                    P2WPKH
                  </button>
                  <button className={`inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${addressType === 'p2pkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`} onClick={() => switchAddressType('p2pkh')}>
                    P2PKH
                  </button>
                </section>
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
  );
}