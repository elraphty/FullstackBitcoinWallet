import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Sidebar: NextPage = () => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if(window) {
      const _url = window.location.pathname.replace('/','');
      setUrl(_url);
    }
  }, []);

  return (
    <div className='sidebar'>
      <ul>
        <li className={`${url === 'addresses' ? 'activeLink' : ''}`} ><Link href="/addresses">Addresses</Link></li>
        <li className={`${url === 'utxos' ? 'activeLink' : ''}`}><Link href="/utxos">Utxos</Link></li>
        <li className={`${url === 'transactions' ? 'activeLink' : ''}`}><Link href="/transactions">Transactions</Link></li>
        <li className={`${url === 'wallet' ? 'activeLink' : ''}`}><Link href="/">Wallet</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar;