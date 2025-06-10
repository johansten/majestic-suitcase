import { useContext, useState } from 'react'
import {
    StandardConnect,
    StandardDisconnect,
    StandardEvents,
    type WalletAccount,
} from '@wallet-standard/core';

import type { StellarWallet } from '@majestic-suitcase/core';

import { WalletContextInternal } from '../wallet-provider/index.js';
import { Disconnected } from './disconnected.js';
import { Connected } from './connected.js';

export function WalletConnector() {
    const context = useContext(WalletContextInternal);
    const [wallet, setWallet] = useState<StellarWallet>();
    const [isConnected, setIsConnected] = useState(false);

    function onSelectedAccount(account: WalletAccount) {
        //  @ts-ignore
        context.setAccount(account);
    }

    async function disconnect() {
        if (!wallet) {
            return;
        }

        await wallet.features[StandardDisconnect].disconnect();
        setIsConnected(false);
        setWallet(undefined);

        //  @ts-ignore
        context.setAccount(undefined);
        //  @ts-ignore
        context.setWallet(undefined);
    }

    async function onSelectedWallet(x: StellarWallet) {
        setWallet(x);
        context.setWallet(x);

        try {
/*
            x.features[StandardEvents].on('change', (x) => {
                console.log('change', x);
            });
*/
            const result = await x.features[StandardConnect].connect();
            if (!result.accounts) {
                throw 'error'
            }

            //  @ts-ignore
            context.setAccount(result.accounts[0]);
            setIsConnected(true);
        } catch {};
    }

    return (
        <>
            { isConnected ?
                <Connected wallet={wallet!} onSelected={onSelectedAccount} onDisconnect={disconnect}/> :
                <Disconnected onSelected={onSelectedWallet}/>
            }
        </>
    )
}
