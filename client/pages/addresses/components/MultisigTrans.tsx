import { useCallback, useState, useMemo } from "react";
import { Formik, Form, FieldArray, Field, getIn } from 'formik';
import * as Yup from "yup";

export type FormValues = {
    keys: [{
        pubKey: string;
    }]
};

const validationSchema = Yup.object().shape({
    keys: Yup.array()
        .of(
            Yup.object().shape({
                pubKey: Yup.string().required('This field is required!'),
            })
        )
        .required('Must have public keys')
        .min(2, 'Minimum of 2 public keys is required'),
});

const P2SH = () => {
    const [btnText, setBtnText] = useState<string>('Create address');

    const initialValues = useMemo(
        (): FormValues => ({
            keys: [{
                pubKey: '',
            }]
        }),
        [],
    );

    const formSubmit = useCallback(async (values: FormValues, { setSubmitting }) => {
        setBtnText('Creating... address');
        // await createTransaction(values.recipientAddress, values.amountToSend, addressType);
        setSubmitting(false);
        setBtnText('Create address');
    }, []);

    const FormTextArea = (props: any) => (
        <textarea
            rows={2}
            className="flex-1 block w-full rounded-md sm:text-sm p-3 border-solid border-2 border-[#C8C8C9]"
            placeholder="pkljslhh35k7e6g9zqk6r99999999999999nxp246a992pduq0jfg0fnl"
            {...props}
        />
    );

    // @ts-ignore
    const ErrorMessage = ({ name }) => (
        <Field
            name={name}
              // @ts-ignore
            render={({ form }) => {
                const error = getIn(form.errors, name);
                const touch = getIn(form.touched, name);
                return touch && error ? <p className="formErrors pt-4">{error}</p> : null;
            }}
        />
    );


    return (
        <div className="py-4 flex align-center justify-center">
            <div className="w-full" style={{ maxWidth: 800 }}>
                <div className="mt-5 md:mt-0 md:col-span-2 w-full">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={formSubmit}>{({ values, errors, touched, handleChange, isSubmitting }) => (
                        <Form>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                                    <FieldArray name="keys">
                                        {({ insert, remove, push }) => (
                                            <>
                                                <div className="grid grid-cols-3 gap-6">
                                                    {values.keys.length > 0 && values.keys.map((pkey, i) => (
                                                        <>
                                                            <div className="col-span-3 sm:col-span-2" key={i}>
                                                                <label
                                                                    htmlFor="recipientAddress"
                                                                    className="block text-sm font-medium text-gray-700"
                                                                >
                                                                    User pubkey...
                                                                </label>
                                                                <div className="mt-1 rounded-md shadow-sm">
                                                                    <Field name={`keys[${i}].pubKey`} as={FormTextArea} />
                                                                </div>
                                                                <ErrorMessage name={`keys[${i}].pubKey`} />
                                                            </div>
                                                            <section className="col-span-1">
                                                                <button className="py-1 px-1 border border-transparent shadow-sm text-xs font-small rounded-md text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 " onClick={() => {
                                                                    if (i !== 0) remove(i)
                                                                }}>X</button>
                                                            </section>
                                                        </>

                                                    ))}

                                                </div>
                                                <button className="inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2" onClick={() => push({ pubKey: '' })}>Add key</button>
                                            </>

                                        )}
                                    </FieldArray>
                                    {typeof errors.keys === 'string' ? <p className="formErrors">{errors.keys}</p> : null}
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    type="submit"
                                >
                                    {btnText}
                                </button>
                            </div>

                        </Form>
                    )}</Formik>
                </div>
            </div>
        </div >
    );
};

export default P2SH;