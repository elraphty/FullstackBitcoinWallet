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
            <h1 className="greeting">Hello Bitcoineer!</h1>
        </BodyWrap>
    </>
  )
}

export default Dashboard;