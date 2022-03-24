import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import styles from '../styles/login.module.css';

export type SignupFormValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This field is required!').email('Input a valid email'),
  password: Yup.string().required('This field is required!').min(6, 'Password must be up to six(6) characters')
});

const Signup: NextPage = () => {
  const inputClassName = useMemo(
    () =>
      "px-5 h-9 2xl:h-10 w-full flex items-center text-xs font-normal text-brand-text border border-solid border-[#F1F1F1] rounded-md 2xl:text-sm",
    [],
  );

  const initialValues = useMemo(
    (): SignupFormValues => ({
      email: '',
      password: '',
    }),
    [],
  );

  const formSubmit = useCallback((values: SignupFormValues, { setSubmitting }) => {
    setSubmitting(false);
  }, []);

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
                className="font-bold mt-4 bg-purple-500 text-white rounded p-2 w-full">
                Create account
              </button>
            </section>
          </Form>
        )}</Formik>
      </main>
    </div>
  )
}

export default Signup;
