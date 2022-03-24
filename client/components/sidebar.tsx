import type { NextPage } from 'next';
import Link from 'next/link';

const Sidebar: NextPage = () => {
  return (
    <div className='sidebar'>
      <ul>
        <li>Addresses</li>
        <li>Utxos</li>
        <li>Transactions</li>
        <li>Wallet</li>
      </ul>
    </div>
  )
}

export default Sidebar;