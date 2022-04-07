import type { NextPage } from 'next';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';

const Dashboard: NextPage = () => {
  return (
    <>
        <Sidebar />
        <Topbar />
        <BodyWrap>
            <h1 className="greeting">Hello Bitcoineer! Welcome to my simple wallet, you can</h1>
            <section className="relative block w-full border-2 border-gray-300 border-dashed p-5 mt-5">
              <ul className="description">
                <li className="base_li">Addresses
                  <ol>
                    <li>Generate P2WPKH, and P2PKH addresses, with their change addresses</li>
                  </ol>
                </li>
                <li className="base_li">UTXOS
                  <ol>
                    <li>View P2WPKH, and P2PKH Unspent Transaction Outputs (UTXOS)</li>
                  </ol>
                </li>
                <li className="base_li">Transactions
                  <ol>
                    <li>View P2WPKH, and P2PKH transactions</li>
                    <li>Create transactions with P2WPKH, and P2PKH addresses</li>
                  </ol>
                </li>
                <li className="base_li">Receive
                  <ol>
                    <li>You can switch between P2WPKH, and P2PKH copy then copy the generated address</li>
                  </ol>
                </li>
                <li className="base_li">Settings
                  <ol>
                    <li>Copy master public key</li>
                    <li>Copy and hide master private key</li>
                  </ol>
                </li>
              </ul>
            </section>
        </BodyWrap>
    </>
  )
}

export default Dashboard;