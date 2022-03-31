import { useState } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import { DecoratedUtxo } from '../../types';

import TransactionSuccessAlert from './TransactionSuccessAlert';

interface Props {
    transaction: Psbt;
    utxos: DecoratedUtxo[];
    broadcastTx: () => Promise<string>;
    tHex: string;
}

const TransactionSummary = ({ transaction, utxos, broadcastTx, tHex }: Props) => {
    const [txId, setTxId] = useState("");
    const [error, setError] = useState("");

    const broadcastTxFromForm = async () => {
        const txId = await broadcastTx();
        setTxId(txId);
    };

    return (
        <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Transaction summary</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="mt-3 mb-3 text-lg text-gray-500">Transaction ID: {tHex}</h3>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                        onClick={() => broadcastTxFromForm()}
                    >
                        Broadcast transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionSummary;
