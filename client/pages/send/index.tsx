import { useEffect, useState } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import BodyWrap from '../../components/BodyWrap';

import CreateTxForm from './components/CreateTxForm';
import TransactionSummary from './components/TransactionSummary';

import { DecoratedUtxo } from '../types';
import { postWithToken, getWithToken } from '../../helpers/axios';
import { getFromStorage } from '../../helpers/localstorage';

export default function Send() {
    const [step, setStep] = useState(0);
    const [transaction, setTransaction] = useState<Psbt | undefined>(undefined);
    const [error, setError] = useState<string>('');
    const [tHex, setTHex] = useState<string>('');
    const [utxos, setUtxos] = useState<DecoratedUtxo[]>([]);

    useEffect(() => {
        const getUtxos = async () => {
            const token = await getFromStorage('token');

            if (token) {
                const utxosRes = await getWithToken('wallet/utxos', token);

                setUtxos(utxosRes.data.data);
            }
        };

        getUtxos();
    }, []);

    const createTransactionWithFormValues = async (
        recipientAddress: string,
        amountToSend: number
    ) => {
        const token = await getFromStorage('token');
        try {
            if (token) {
                const body = {
                    recipientAddress,
                    amount: Number(amountToSend)
                }
                // console.log('Body ====', body);

                const res = await postWithToken('wallet/createtransaction', body, token);

                // console.log('Transaction Res ===', res);

                setTransaction(res.data.data.transaction.data);
                setTHex(res.data.data.tHex.txHex);
                setStep(1);

            }
        } catch (e) {
            // console.log('Transaction error ==', e);
            setError((e as Error).message);
        }
    };

    const broadcastTx = async (): Promise<string> => {
        const token = await getFromStorage('token');
        let txHex: string = '';
        if (token) {
            const body = {
                txHex: tHex,
            }
            const res = await postWithToken('wallet/broadcasttransaction', body, token);
            txHex = res.data.data;

        }
        return txHex;
    };

    return (
        <BodyWrap>
            <div>
                <main className="flex-1">
                    <div className="">
                        <div className="max-w-7xl mx-auto">
                            {step === 0 && (
                                <CreateTxForm
                                    error={error}
                                    createTransaction={createTransactionWithFormValues}
                                />
                            )}
                            {step === 1 && (
                                <TransactionSummary
                                    transaction={transaction!}
                                    utxos={utxos}
                                    broadcastTx={broadcastTx}
                                    tHex={tHex}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </BodyWrap>
    );
}