import type { NextPage } from 'next';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';
import { useRouter } from 'next/router';
import { getFromStorage } from '../helpers/localstorage';

const Dashboard: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getFromStorage('token');
    if(!token) {
      router.push('/login');
    }
  }, [router])

  return (
    <>
        <Sidebar />
        <Topbar />
        <BodyWrap>
            <h1 className="greeting">Hello Bitcoineer!</h1>
        </BodyWrap>
    </>
  )
}

export default Dashboard;