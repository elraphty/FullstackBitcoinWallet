import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setToStorage } from '../helpers/localstorage';
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from 'next/link';

const MobileNav: NextPage = () => {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        if (window) {
            const _url = window.location.pathname.replace('/', '');
            setUrl(_url);
        }
    }, []);

    const logout = async () => {
        await setToStorage('token', '');
        router.push('/login');
    }

    const toggleMobileNav = () => {
        setShowNav(!showNav);
    }

    return (
        <div className='mobilenav'>
            <section className="right">
                <MenuIcon className="h-7 w-7 text-gray-800" onClick={toggleMobileNav}/>
            </section>
            <aside className="mobilenav-pop" style={{display: `${showNav ? 'block' : 'none'}`}}>
                <XIcon className="h-7 w-7 font-black text-white cancel-icon" onClick={toggleMobileNav} />
                <ul>
                    <li className={`${url === 'addresses' ? 'activeLink' : ''}`} ><Link href="/addresses">Addresses</Link></li>
                    <li className={`${url === 'utxos' ? 'activeLink' : ''}`}><Link href="/utxos">Utxos</Link></li>
                    <li className={`${url === 'transactions' ? 'activeLink' : ''}`}><Link href="/transactions">Transactions</Link></li>
                    <li className={`${url === 'send' ? 'activeLink' : ''}`}><Link href="/send">Send</Link></li>
                    <li className={`${url === 'receive' ? 'activeLink' : ''}`}><Link href="/receive">Receive</Link></li>
                    <li className={`${url === 'settings' ? 'activeLink' : ''}`}><Link href="/settings">Settings</Link></li>
                </ul>

                <p onClick={logout}>Logout</p>
            </aside>
        </div>
    )
}

export default MobileNav;