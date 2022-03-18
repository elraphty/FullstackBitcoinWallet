import type { NextPage } from 'next'
import Head from 'next/head'
import { useMemo } from 'react'
import styles from '../styles/login.module.css'

const Signup: NextPage = () => {
  const inputClassName = useMemo(
    () =>
      "px-5 h-9 2xl:h-10 w-full flex items-center text-xs font-normal text-brand-text border border-solid border-[#F1F1F1] rounded-md 2xl:text-sm",
    [],
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Bitcoin wallet</title>
        <meta name="description" content="Bitcoinwallet Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.wrap}>
          <h2 className="form_heading">User Signup</h2>
        </div>
        <div className={styles.wrap}>
          <section className="inputgroup">
            <label htmlFor="URL" className="form__label">
              Email
            </label>
            <div className="flex items-center w-full">
              <input
                id="URL"
                className={inputClassName}
                type="text"
                placeholder="Your email"
              />
            </div>
          </section>
        </div>
        <div className={styles.wrap}>
          <section className="inputgroup">
            <label htmlFor="URL" className="form__label">
              Password
            </label>
            <div className="flex items-center w-full">
              <input
                id="URL"
                className={inputClassName}
                type="password"
                placeholder="Your email"
              />
            </div>
          </section>
        </div>
        <section className={styles.wrap}>
          <button
            onClick={() => {}}
            className="font-bold mt-4 bg-purple-500 text-white rounded p-2 w-full">
            Create account
          </button>
        </section>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Signup;
