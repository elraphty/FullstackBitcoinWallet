import type { NextPage } from 'next';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import BodyWrap from '../components/bodywrap';

const Dashboard: NextPage = () => {
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