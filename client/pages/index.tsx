import type { NextPage } from 'next';
import { useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import BodyWrap from '../components/bodywrap';
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
            <h1 className="greeting">Hello Raphael!</h1>
        </BodyWrap>
    </>
  )
}

export default Dashboard;