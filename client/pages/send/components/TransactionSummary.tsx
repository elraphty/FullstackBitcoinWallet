import { Dispatch, SetStateAction, useState } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import { DecoratedUtxo } from '../../types';
import {
    SortAscendingIcon,
    SortDescendingIcon,
    ArrowLeftIcon
} from "@heroicons/react/outline";

import TransactionSuccessAlert from './TransactionSuccessAlert';

interface Props {
    transaction: Psbt;
    utxos: DecoratedUtxo[];
    broadcastTx: () => Promise<string>;
    tHex: string;
    txId: string;
    status: string;
    setStep: Dispatch<SetStateAction<number>>
}

const TransactionSummary = ({ transaction, utxos, broadcastTx, tHex, status, txId, setStep }: Props) => {
    const [btnText, setBtnText] = useState('Broadcast transaction');
    const [btnDis, setBtnDis] = useState(false);
    const [error, setError] = useState('');

    const broadcastTxFromForm = async () => {
        setBtnText('Broadcasting transaction....');
        setBtnDis(true);

        broadcastTx().then(res => {
            setBtnText('Broadcasted transaction');
            setBtnDis(true);
        })
            .catch(e => {
                setBtnText('Broadcast transaction');
                setBtnDis(false);
            });
    };

    return (
        <div className="mt-10 lg:mt-0">
             <ArrowLeftIcon className="h-8 w-8 mb-2 text-gray-500 cursor-pointer" aria-hidden="true" onClick={() => setStep(0)} />

            <h2 className="text-lg font-medium text-gray-900">Transaction summary</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                {status === 'success' ? <TransactionSuccessAlert txid={txId} /> : null}
                <h3 className="mt-3 mb-3 text-lg text-gray-500">Transaction Hex: {tHex}</h3>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                        type="submit"
                        disabled={btnDis}
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                        onClick={() => broadcastTxFromForm()}
                    >
                        {btnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionSummary;
