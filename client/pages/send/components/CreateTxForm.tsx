import { useMemo, useCallback } from "react";
import { Formik, Form } from 'formik';
import * as Yup from "yup";

interface Props {
    createTransaction(recipientAddress: string, amountToSend: number): void;
    error: string;
}

export type FormValues = {
    recipientAddress: string;
    amountToSend: number;
};

const validationSchema = Yup.object().shape({
    recipientAddress: Yup.string().required('This field is required!'),
    amountToSend: Yup.string().required('This field is required!')
});

const CreateTxForm = ({ createTransaction, error }: Props) => {
    const initialValues = useMemo(
        (): FormValues => ({
            recipientAddress: '',
            amountToSend: 0,
        }),
        [],
    );

    const formSubmit = useCallback((values: FormValues, { setSubmitting }) => {
        createTransaction(values.recipientAddress, values.amountToSend);
        setSubmitting(false);
    }, [createTransaction]);

    return (
        <div className="py-4 flex align-center justify-center">
            <div className="w-full" style={{ maxWidth: 800 }}>
                <div className="mt-5 md:mt-0 md:col-span-2 w-full">
                    <Formik initialValues={initialValues} onSubmit={formSubmit} validationSchema={validationSchema}>{({ values, handleChange, isSubmitting, errors }) => (
                        <Form>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-3 sm:col-span-2">
                                            <label
                                                htmlFor="recipientAddress"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Send bitcoin to...
                                            </label>
                                            <div className="mt-1 rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="recipientAddress"
                                                    className="flex-1 block w-full rounded-md sm:text-s px-3 border-solid border-2 border-[#C8C8C9]"
                                                    placeholder="bc1qlhh35k7e6g9zqk6rnxp246a992pduq0jfg0fnl"
                                                    value={values.recipientAddress}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.recipientAddress ? <p className="formErrors">{errors.recipientAddress}</p> : null}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-3 sm:col-span-2">
                                            <label
                                                htmlFor="price"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Amount to send in sats ...
                                            </label>
                                            <div className="mt-1 rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="amountToSend"
                                                    className="block w-full pr-12 sm:text-sm rounded-md px-3 border-solid border-2 border-[#C8C8C9]"
                                                    placeholder="42069"
                                                    aria-describedby="price-currency"
                                                    value={values.amountToSend}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.amountToSend ? <p className="formErrors">{errors.amountToSend}</p> : null}
                                        </div>
                                    </div>
                                </div>
                                {error && (
                                    <div className="px-4 py-5 bg-white space-y-6 sm:px-6 sm:pb-2 sm:pt-0 text-red-500 text-xs">
                                        Error: {error}
                                    </div>
                                )}
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-tabconf-blue-600 hover:bg-tabconf-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tabconf-blue-500"
                                        type="submit"
                                    >
                                        Create transaction
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}</Formik>
                </div>
            </div>
        </div >
    );
};

export default CreateTxForm;