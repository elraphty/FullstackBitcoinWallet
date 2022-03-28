import type { NextPage } from 'next';
import Link from 'next/link';

const Sidebar: NextPage = () => {
  return (
    <div className='sidebar'>
      <ul>
        <li><Link href="/addresses">Addresses</Link></li>
        <li><Link href="/utxos">Utxos</Link></li>
        <li><Link href="/">Transactions</Link></li>
        <li><Link href="/">Wallet</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar;