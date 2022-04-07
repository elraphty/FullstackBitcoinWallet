import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import AddressRow from './components/AddressRow';
import EmptyState from './components/EmptyState';
import BodyWrap from '../../components/BodyWrap';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken } from '../../helpers/axios';
import Loader from '../../components/Loader';
import WalletContext from '../../components/WalletContext';

import { Address } from '../types';

function Addresses() {
    const [currentTab, setCurrentTab] = useState("external");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [changeAddresses, setChangeAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [addressType, setAddressType] = useState<string>('p2wpkh');
    const { getValue } = useContext(WalletContext);


    const getAddresses = useCallback(async () => {
        const token = await getFromStorage('token');

        if (token) {
            setIsLoading(true);

            const addresses = await getWithToken(`wallet/getaddress?type=${addressType}`, token);

            setAddresses(addresses.data.data.address);
            setChangeAddresses(addresses.data.data.changeAddress);
            setIsLoading(false);
        }
    }, [addressType]);

    useEffect(() => {
        getAddresses();
    }, [getAddresses, getValue]);

    const switchAddressType = useCallback((_type: string) => {
        setAddressType(_type);
        if (_type !== 'p2sh') {
            getAddresses();
        } else {
            alert('else');
        }
    }, [getAddresses]);

    const classNames = (...classes: string[]) => {
        return classes.filter(Boolean).join(" ");
    };

    const tabs = useMemo(() => [
        {
            name: "Receive",
            href: "external",
            count: addresses.filter((address) => address.type !== "used").length,
            current: currentTab === "external",
        },
        {
            name: "Change",
            href: "change",
            count: changeAddresses.filter((address) => address.type !== "used")
                .length,
            current: currentTab === "change",
        },
    ], [addresses, changeAddresses, currentTab]);

    return (
        <BodyWrap>
            {!isLoading ? (<div className="min-h-full">
                <main className="flex-1">
                    <div className="">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="sm:text-xl xs:text-sm lg:text-2xl font-semibold text-gray-900">Addresses</h1>
                            <section className="mt-3 mb-2">
                                <button className={`inline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  ${addressType === 'p2wpkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`}
                                    onClick={() => switchAddressType('p2wpkh')
                                    }>
                                    P2WPKH
                                </button>
                                <button className={`inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${addressType === 'p2pkh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`} onClick={() => switchAddressType('p2pkh')}>
                                    P2PKH
                                </button>
                                <button className={`inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${addressType === 'p2sh' ? 'bg-purple-900 text-white' : 'text-gray-700'} focus:outline-none`} onClick={() => switchAddressType('p2sh')}>
                                    P2SH
                                </button>
                            </section>
                            {
                                addressType !== 'p2sh' ?
                                    (<div className="py-3">
                                        <div className="max-w-7xl mx-auto bg-white shadow rounded-t-md">
                                            {/* Tabs */}
                                            <div className="sm:hidden">
                                                <label htmlFor="tabs" className="sr-only">
                                                    Select a tab
                                                </label>
                                                <select
                                                    id="tabs"
                                                    name="tabs"
                                                    className="mt-4 block w-full pl-3 pr-10 py-2 xs:text-sm text-base border-gray-300 focus:outline-none focus:ring-tabconf-blue-500 focus:border-tabconf-blue-500 sm:text-sm rounded-md"
                                                    //   @ts-ignore
                                                    defaultValue={tabs.find((tab) => tab.current).name}
                                                >
                                                    {tabs.map((tab) => (
                                                        <option key={tab.name}>{tab.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="hidden sm:block">
                                                <div className="border-b border-gray-200">
                                                    <nav
                                                        className="mt-2 -mb-px flex space-x-8 px-4 sm:px-6 md:px-4"
                                                        aria-label="Tabs"
                                                    >
                                                        {tabs.map((tab) => (
                                                            <button
                                                                key={tab.name}
                                                                onClick={() => setCurrentTab(tab.href)}
                                                                className={classNames(
                                                                    tab.current
                                                                        ? "border-tabconf-blue-500 text-tabconf-blue-600"
                                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                                                                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                                                )}
                                                            >
                                                                {tab.name}
                                                                {tab.count ? (
                                                                    <span
                                                                        className={classNames(
                                                                            tab.current
                                                                                ? "bg-tabconf-blue-100 text-tabconf-blue-600"
                                                                                : "bg-gray-100 text-gray-900",
                                                                            "hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                                                                        )}
                                                                    >
                                                                        {tab.count}
                                                                    </span>
                                                                ) : null}
                                                            </button>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>

                                        {currentTab === "external" ? (
                                            addresses.length ? (
                                                addresses.map((address, i) => (
                                                    <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0 bg-white rounded-b-md shadow" key={i}>
                                                        <AddressRow address={address} />
                                                    </ul>
                                                ))
                                            ) : (
                                                <EmptyState />
                                            )
                                        ) : null}

                                        {currentTab === "change" ? (
                                            changeAddresses.length ? (
                                                changeAddresses.map((address, i) => (
                                                    <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0 bg-white rounded-b-md shadow" key={i}>
                                                        <AddressRow address={address} />
                                                    </ul>
                                                ))
                                            ) : (
                                                <EmptyState />
                                            )
                                        ) : null}
                                    </div>)
                                    : null
                            }

                        </div>
                    </div>
                </main>
            </div>) : <Loader />}
        </BodyWrap>
    );
}

export default Addresses;