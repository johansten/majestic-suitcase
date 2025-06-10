import type {
    StandardConnectFeature,
    StandardDisconnectFeature,
    StandardEventsFeature,
    Wallet,
} from '@wallet-standard/core';

import { isStellarChain } from './chains.js';
import type { StellarSignMessageFeature } from './signMessage.js';
import type { StellarSignTransactionFeature } from './signTransaction.js';
import type { StellarSignAuthEntryFeature } from './signAuthEntry.js';

export * from './chains.js';
export * from './signMessage.js';
export * from './signTransaction.js';
export * from './signAuthEntry.js';

export type StellarFeatures = StellarSignMessageFeature & StellarSignTransactionFeature & StellarSignAuthEntryFeature;

type StandardFeatures = StandardConnectFeature & StandardDisconnectFeature & StandardEventsFeature;

export type StellarWallet = Wallet & {
    features: StandardFeatures & StellarFeatures;
}

export function isStellarStandardWallet(wallet: Wallet): boolean {
    return (wallet.chains.filter(isStellarChain).length !== 0);
}
