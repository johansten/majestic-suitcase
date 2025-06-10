import React, { type Dispatch, type SetStateAction, useContext, useState } from 'react'; 
import type { WalletAccount } from '@wallet-standard/core';

import {
    StellarSignMessage,
    StellarSignTransaction,
    type StellarWallet,
    type StellarSignMessageInput,
    type StellarSignMessageMethod
} from '@majestic-suitcase/core';

export type WalletContext = {
    account: WalletAccount;
    wallet: StellarWallet;
    signMessage: StellarSignMessageMethod;
}

type WalletContextInternalType = {
    account: WalletAccount;
    wallet: StellarWallet;
    setAccount: Dispatch<SetStateAction<WalletAccount>>;
    setWallet: Dispatch<SetStateAction<StellarWallet>>;
}

//  @ts-ignore
export const WalletContextInternal = React.createContext<WalletContextInternalType>({});

// WalletProvider Component
export function WalletProvider({ children }: any) {
    const [account, setAccount] = useState<WalletAccount>();
    const [wallet, setWallet] = useState<StellarWallet>();

    // Value provided to context
    const value = {
        account,
        wallet: wallet!,
        setAccount,
        setWallet,
    };

    return (
        //  @ts-ignore
        <WalletContextInternal.Provider value={value}>
            {children}
        </WalletContextInternal.Provider>
    );
}

function signMessage(this: WalletContextInternalType, args: StellarSignMessageInput) {
    console.log(this);
    return this.wallet.features[StellarSignMessage].signMessage(args);
}

export function useWalletContext() {
    const context = useContext(WalletContextInternal);
    if (!context) {
       throw new Error('useWalletContext must be used within a WalletProvider');
    }

    try {
        return {
            account: context.account,
            wallet: context.wallet,
            signMessage: signMessage.bind(context.wallet)
        }
    } catch {
        return undefined;
    }
}
