import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import BodyWrap from '../../components/BodyWrap';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';

const defaulPrivKey = '***************************************************************************************************************';

export default function Settings() {
    const [privKey, setPrivKey] = useState(defaulPrivKey);
    const [pubKey, setPubKey] = useState('xpubFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');

    useEffect(() => {
        const getPublicKey = async () => {
            const token = await getFromStorage('token');

            if (token) {
                const addresses = await getWithToken('wallet/publicKey', token);
                setPubKey(addresses.data.data);
            }
        };

        getPublicKey();
    }, []);

    const getPrivKey = useCallback(async () => {
        const token = await getFromStorage('token');

        if (token) {
            const addresses = await getWithToken('wallet/privateKey', token);
            setPrivKey(addresses.data.data);
            navigator.clipboard.writeText(
                addresses.data.data
            );
        }
    }, []);

    return (
        <BodyWrap>
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="w-full px-5 mt-10 xs:mt-4 sm:mt-8" style={{ maxWidth: 800 }}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden  p-5 mb-10">
                        <h3 className="text-lg font-black">Public Key</h3>
                        <textarea value={pubKey} disabled className="w-full p-5 mt-3 text-sm bg-gray-100 xs:text-xs" />
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    pubKey
                                )
                            }
                            className="mt-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none"
                        >
                            Copy public key
                        </button>
                    </div>
                    <div className="shadow sm:rounded-md sm:overflow-hidden  p-5 mb-10">
                        <h3 className="text-lg font-black">Private Key</h3>
                        <p className="text-red-500 text-sm font-bold my-3">Keep your private key extremely safe, anyone who has access to your private key will also have access to all you BITCOINS</p>
                        <textarea value={privKey} disabled className="w-full p-5 mt-3 text-sm bg-gray-100 xs:text-xs" />
                        <button
                            onClick={getPrivKey}
                            className="mt-4 inline justify-center py-2 px-4 border border-transparent shadow-sm xs:text-xs sm:text-sm font-medium rounded-md text-white bg-red-500  focus:outline-none"
                        >
                            Copy private key
                        </button>
                        <button
                            onClick={() => setPrivKey(defaulPrivKey)}
                            className="mt-4 inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none"
                        >
                            Hide private key
                        </button>
                    </div>
                </div>
            </main>
        </BodyWrap>
    );
}