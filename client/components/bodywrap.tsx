import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { getFromStorage } from '../helpers/localstorage';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { WalletContextType, WalletProvider } from './WalletContext';
import { DecoratedUtxo, Address } from '../pages/types';
import { getWithToken } from '../helpers/axios';

const BodyWrap: NextPage = (props) => {
  const router = useRouter();
  const [utxos, setUtxos] = useState<DecoratedUtxo[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [changeAddresses, setChangeAddresses] = useState<Address[]>([]);
  const [walletBalance, setBalance] = useState<number>(0);

  useEffect(() => {
    const token = getFromStorage('token');
    if (!token) {
      router.push('/login');
    }
  }, [router, utxos])

  useEffect(() => {
    const getData = async () => {
      const token = await getFromStorage('token') || '';
      // Get Addresses
      const getAddresses = async () => {
        const addresses = await getWithToken('wallet/getaddress', token);
        // console.log('Addresses ==', addresses);

        setAddresses(addresses.data.data.address);
        setChangeAddresses(addresses.data.data.changeAddress);
      };

      // const getUtxos = async () => {
      //   const utxosRes = await getWithToken('wallet/utxos', token);

      //   setUtxos(utxosRes.data.data);

      //   const data: DecoratedUtxo[] = utxosRes.data.data;

      //   // If the UTXO length is more than 0
      //   if (data.length > 0) {
      //     // Loop to sum utxo values
      //     let balance: number = 0;

      //     for (let utxo of utxos) {
      //       balance += utxo.value;
      //     }

      //     setBalance(balance);
      //   }
      // };


      // getUtxos();
      getAddresses();
    }
    getData();
  }, [utxos])

  const getContextValue = useCallback(() => ({
    addresses,
    changeAddresses,
    utxos,
    walletBalance
  }), [addresses, changeAddresses, utxos, walletBalance]);

  return (
    <>
      <Sidebar />
      <Topbar />
      <WalletProvider value={{ getValue: getContextValue }}>
        <div className='bodywrap'>
          {props.children}
        </div>
      </WalletProvider>
    </>
  )
}

export default BodyWrap;