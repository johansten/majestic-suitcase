import { useEffect, useState } from 'react';
import { getWallets, type Wallet } from '@wallet-standard/core';
import {
    type StellarWallet,
    isStellarStandardWallet,
 } from '@majestic-suitcase/core';

const { get, on } = getWallets();

function getStellarStandardWallets(): readonly StellarWallet[] {
    return get().filter(isStellarStandardWallet) as StellarWallet[];
}

type WalletListProps = {
    setValue: (arg: StellarWallet) => void;
}

export function WalletList({ setValue }: WalletListProps) {
    const [wallets, setWallets ] = useState<readonly StellarWallet[]>(getStellarStandardWallets());

    useEffect(() => {
        on('register', () => setWallets(getStellarStandardWallets));
        on('unregister', () => setWallets(getStellarStandardWallets));
    }, []);

    return (<ul>
        { wallets.map((wallet, index) => (
            <li key={ index }>
                <button className='h-12 w-full flex items-center text-lg' onClick={() => setValue(wallet)}>
                    <img className='h-7 w-7 mr-3' src={ wallet.icon }></img>
                    { wallet.name }
                </button>
            </li>
        )) }
    </ul>);
}
