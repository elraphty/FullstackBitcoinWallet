import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from "yup";
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '../helpers/axios';
import { setToStorage, getFromStorage } from '../helpers/localstorage';

export type LoginFormValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This field is required!').email('Input a valid email'),
  password: Yup.string().required('This field is required!').min(6, 'Password must be up to six(6) characters')
});

const Login: NextPage = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const token = getFromStorage('token');
    if(token) {
      router.push('/');
    }
  }, [router])

  const inputClassName = useMemo(
    () =>
      "px-5 h-9 2xl:h-10 w-full flex items-center text-xs font-normal text-brand-text border border-solid border-[#F1F1F1] rounded-lg 2xl:text-sm",
    [],
  );

  const initialValues = useMemo(
    (): LoginFormValues => ({
      email: '',
      password: '',
    }),
    [],
  );

  const formSubmit = useCallback((values: LoginFormValues, { setSubmitting }) => {
    const body: LoginFormValues = {
      email: values.email,
      password: values.password
    };

    axios.post(`${BASE_URL}user/login`, body)
      .then(async res => {
        await setToStorage('token', res.data.data.token);
        router.push('/');
      })
      .catch(err => {
        setLoginError('Could not login, username or password is incorrect');
      });
    
    setSubmitting(false);
  }, [router]);

  return (
    <div className="container">
      <Head>
        <title>Bitcoin wallet</title>
        <meta name="description" content="Bitcoinwallet Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="wrap">
          <h2 className="form_heading">User Login</h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={formSubmit} >{({ values, errors, isSubmitting, handleChange }) => (
          <Form>
            {loginError? <p className="formErrors">{loginError}</p> : null}
            <div className="wrap">
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
                    onChange={handleChange}
                  />
                </div>
              </section>
              {errors.email ? <p className="formErrors">{errors.email}</p> : null}
            </div>
            <div className="wrap">
              <section className="inputgroup">
                <label htmlFor="Password" className="form__label">
                  Password
                </label>
                <div className="flex items-center w-full">
                  <input
                    id="password"
                    className={inputClassName}
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Your password"
                  />
                </div>
              </section>
              {errors.password ? <p className="formErrors">{errors.password}</p> : null}
            </div>
            <section className="wrap">
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-bold mt-4 bg-purple-500 text-white rounded-lg p-2 w-full">
                Login
              </button>
            </section>
            <p className="form_btm_link"> <Link href="/signup">{"Don't have an account? Signup"}</Link></p>
          </Form>
        )}</Formik>
      </main>
    </div>
  )
}

export default Login
