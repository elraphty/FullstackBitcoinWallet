import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { setToStorage } from '../helpers/localstorage';

const Topbar: NextPage = () => {
  const router = useRouter();

  const logout = async () => {
    await setToStorage('token', '');
    router.push('/login');
  }

  return (
    <div className='topbar'>
      <section className="right">
        <p onClick={logout}>Logout</p>
      </section>
    </div>
  )
}

export default Topbar;