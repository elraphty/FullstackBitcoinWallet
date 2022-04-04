import { useState, useEffect, useCallback } from 'react';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';
import QRCode from 'react-qr-code';
import BodyWrap from '../../components/BodyWrap';

import { Address } from '../types';

export default function Receive() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [index, setIndex] = useState(0);
    const [addressType, setAddressType] = useState<string>('p2wpkh');

    const getNewAddress = () => {
        if (index < addresses.length - 1) {
            setIndex(index + 1);
        } else {
            setIndex(0);
        }
    };

    const getAddresses = useCallback(async () => {
        const token = await getFromStorage('token');

        if (token) {
            const addresses = await getWithToken(`wallet/getaddress?type=${addressType}`, token);
            setAddresses(addresses.data.data.address);
        }
    }, [addressType]);

    useEffect(() => {
        getAddresses();
    }, [getAddresses]);

    const switchAddressType = useCallback((_type: string) => {
        setAddressType(_type);
        getAddresses();
    }, [getAddresses]);

    return (
        <BodyWrap>
            <div>
                <main className="flex-1">
                    <div className="">
                        <div className="max-w-7xl mx-auto">
                            <section className="mt-3 mb-2">
                                <button className={`inline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  ${addressType === 'p2wpkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`}
                                    onClick={() => switchAddressType('p2wpkh')
                                    }>
                                    P2WPKH
                                </button>
                                <button className={`inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${addressType === 'p2pkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`} onClick={() => switchAddressType('p2pkh')}>
                                    P2PKH
                                </button>
                            </section>
                            <div className="py-4 flex align-center justify-center">
                                <div className="w-full" style={{ maxWidth: 800 }}>
                                    <div className="mt-5 md:mt-0 md:col-span-2 w-full">
                                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <label
                                                            htmlFor="company-website"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Receive bitcoin to...
                                                        </label>
                                                        <div className="mt-1 flex rounded-md shadow-sm">
                                                            <input
                                                                value={
                                                                    addresses[index]
                                                                        ? addresses[index].address
                                                                        : "No addresses found"
                                                                }
                                                                readOnly
                                                                type="text"
                                                                name="company-website"
                                                                id="company-website"
                                                                className="focus:ring-tabconf-blue-500 focus:border-tabconf-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                                                placeholder="bc123dfadfknadifojaodnfa"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex justify-center">
                                                            <QRCode
                                                                fgColor="#053140"
                                                                bgColor="#f3f4f6"
                                                                value={
                                                                    addresses[index]
                                                                        ? addresses[index].address!
                                                                        : "No addresses found"
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                                <button
                                                    onClick={() => getNewAddress()}
                                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tabconf-blue-500 "
                                                >
                                                    Generate next address
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            addresses[index] && addresses[index].address!
                                                        )
                                                    }
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-tabconf-blue-500 hover:bg-tabconf-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tabconf-blue-400 ml-3"
                                                >
                                                    Copy address
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </BodyWrap>
    );
}
