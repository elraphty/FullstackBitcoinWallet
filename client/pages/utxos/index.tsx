import { useEffect, useState } from 'react';
import { DecoratedUtxo } from '../types';
import EmptyState from './components/EmptyState';
import UtxoRow from './components/UtxoRow';
import BodyWrap from '../../components/BodyWrap';
import Loader from '../../components/Loader';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';

export default function Utxos() {
  const [utxos, setUtxos] = useState<DecoratedUtxo[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    const getUtxos = async () => {
      const token = await getFromStorage('token');

      if (token) {
        setIsLoading(true);

        const utxosRes = await getWithToken('wallet/utxos', token);

        setUtxos(utxosRes.data.data);
        setIsLoading(false);

        const data: DecoratedUtxo[] = utxosRes.data.data;
        // If the UTXO length is more than 0
        if (data.length > 0) {
          // Loop to sum utxo values
          let balance: number = 0;
          data.forEach(utxo => {
            balance += utxo.value;
          });

          setWalletBalance(balance);
        }
      }
    };

    getUtxos();
  }, []);

  return (
    <BodyWrap>
      {
        !isLoading ? (
          <div className="min-h-full">
            <main className="flex-1">
              <div className="">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-2xl font-semibold text-gray-900">UTXOs</h1>

                  <h2 className="text-lg text-purple-600 font-bold mt-3">Wallet balance - {walletBalance / 100000000} BTC</h2>
                  <div className="py-4">
                    {utxos.length ? (
                      <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0 bg-white rounded-b-md shadow">
                        {utxos.map((utxo, i) => (
                          <UtxoRow utxo={utxo} key={i} />
                        ))}
                      </ul>
                    ) : (
                      <EmptyState />
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        ) : <Loader />
      }
    </BodyWrap>
  );
}