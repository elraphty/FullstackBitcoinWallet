import { useEffect, useState, useCallback } from 'react';
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
  const [addressType, setAddressType] = useState<string>('p2wpkh');

  const getUtxos = useCallback(async () => {
    const token = await getFromStorage('token');

    if (token) {
      setIsLoading(true);

      const utxosRes = await getWithToken(`wallet/utxos?type=${addressType}`, token);

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
  }, [addressType]);

  useEffect(() => {
    getUtxos();
  }, [addressType, getUtxos]);

  const switchAddressType = useCallback((_type: string) => {
    setAddressType(_type);
    getUtxos();
  }, [getUtxos]);

  return (
    <BodyWrap>
      {
        !isLoading ? (
          <div className="min-h-full">
            <main className="flex-1">
              <div className="">
                <div className="max-w-7xl mx-auto">
                  <h1 className="sm:text-xl xs:text-sm lg:text-2xl font-semibold text-gray-900">UTXOs</h1>

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

                  <h2 className="lg:text-lg sm:text-xl xs:text-sm text-purple-600 font-bold mt-2">Wallet balance - {walletBalance / 100000000} BTC</h2>
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