import React from 'react';
import { DecoratedUtxo, Address } from '../pages/types';

export type WalletContextType = {
    utxos: DecoratedUtxo[];
    addresses: Address[];
    changeAddresses: Address[];
    walletBalance: number;
};

interface WalletValue {
    getValue: () => WalletContextType;
};

const WalletContext = React.createContext<WalletValue>({
    getValue: () => ({
        utxos: [],
        addresses: [],
        changeAddresses: [],
        walletBalance: 0
    })
});

export const WalletProvider = WalletContext.Provider;

export default WalletContext;