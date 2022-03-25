import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useCallback, useState, useRef, ChangeEvent } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import styles from '../styles/login.module.css';
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '../helpers/axios';
import { setToStorage, getFromStorage } from '../helpers/localstorage';
import { useRouter } from 'next/router';

export type SignupFormValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This field is required!').email('Input a valid email'),
  password: Yup.string().required('This field is required!').min(6, 'Password must be up to six(6) characters')
});

const Signup: NextPage = () => {
  const router = useRouter();
  const [signupError, setSignupError] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [modalState, setModalState] = useState<string>('hidden');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const mnemonicRef = useRef<HTMLTextAreaElement>(null);

  const inputClassName = useMemo(
    () =>
      "px-5 h-9 2xl:h-10 w-full flex items-center text-xs font-normal text-brand-text border border-solid border-[#F1F1F1] rounded-lg 2xl:text-sm",
    [],
  );

  const initialValues = useMemo(
    (): SignupFormValues => ({
      email: email || '',
      password: password || '',
    }),
    [email, password],
  );

  const formSubmit = useCallback((values: SignupFormValues, { setSubmitting }) => {
    const body: SignupFormValues = {
      email: values.email,
      password: values.password
    };

    setEmail(values.email);
    setPassword(values.password);

    axios.post(`${BASE_URL}user`, body)
      .then(async res => {
        await setToStorage('token', res.data.data.token);
        const mnedata = await axios.get(`${BASE_URL}wallet/mnenomic`);
        setModalState('block');
        setMnemonic(mnedata.data.data);
      })
      .catch(err => {
        setSignupError('Could not create account');
      });

    setSubmitting(false);
  }, []);

  const generateKeys = useCallback(async () => {
    const value = mnemonicRef.current?.value;

    navigator.clipboard.writeText(value || '');

    const body = {
      email,
      password,
      mnemonic: value,
    }

    console.log('Values === ', body);

    axios.post(`${BASE_URL}wallet/privatekey`, body)
      .then(res => {
        router.push('/');
        setModalState('hidden');
      })
      .catch(e => {
        setSignupError('Could private keys');
      });
  }, [email, password, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Bitcoin wallet signup</title>
        <meta name="description" content="Bitcoinwallet Signup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.wrap}>
          <h2 className="form_heading">User Signup</h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={formSubmit} >{({ values, errors, isSubmitting, handleChange }) => (
          <Form>
            {signupError ? <p className="formErrors">{signupError}</p> : null}
            <div className={styles.wrap}>
              <section className="inputgroup">
                <label htmlFor="Email" className="form__label">
                  Email
                </label>
                <div className="flex items-center w-full">
                  <input
                    id="email"
                    className={inputClassName}
                    type="text"
                    value={values.email}
                    placeholder="Your email"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </div>
              </section>
              {errors.email ? <p className="formErrors">{errors.email}</p> : null}
            </div>
            <div className={styles.wrap}>
              <section className="inputgroup">
                <label htmlFor="Password" className="form__label">
                  Password
                </label>
                <div className="flex items-center w-full">
                  <input
                    id="password"
                    className={inputClassName}
                    type="password"
                    autoComplete="off"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Your password"
                  />
                </div>
              </section>
              {errors.password ? <p className="formErrors">{errors.password}</p> : null}
            </div>
            <section className={styles.wrap}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-bold mt-4 bg-purple-500 text-white rounded-lg p-2 w-full">
                Create account
              </button>
            </section>
            <p className="form_btm_link"> <Link href="/">{"Already have an account? Login"}</Link></p>
          </Form>
        )}</Formik>

        {/** Modal */}
        <div className={`fixed z-10 inset-0 overflow-y-auto ${modalState}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Mnemonic phrase</h3>
                    <p className="mt-3 text-sm text-red-500">{"Save your mnemonic phrase, after closing you won't be able to recover it."}</p>
                    <div className="mt-5">
                      <textarea
                        rows={4}
                        className="w-full py-3 px-4 flex items-center text-lg font-normal border border-solid border-[#C9C9C9] rounded-lg 2xl:text-lg"
                        value={mnemonic}
                        readOnly
                        ref={mnemonicRef}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={generateKeys}
                >
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/** End of mnenomic modal */}

      </main>
    </div>
  )
}

export default Signup;
