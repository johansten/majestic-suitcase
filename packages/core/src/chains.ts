import type { IdentifierString } from '@wallet-standard/base';

export const STELLAR_PUBLIC_CHAIN = 'stellar:public';
export const STELLAR_TESTNET_CHAIN = 'stellar:testnet';
export const STELLAR_FUTURENET_CHAIN = 'stellar:futurenet';
export const STELLAR_SANDBOX_CHAIN = 'stellar:sandbox';
export const STELLAR_STANDALONE_CHAIN = 'stellar:standalone';

export const STELLAR_CHAINS = [
    STELLAR_PUBLIC_CHAIN,
    STELLAR_TESTNET_CHAIN,
    STELLAR_FUTURENET_CHAIN,
    STELLAR_SANDBOX_CHAIN,
    STELLAR_STANDALONE_CHAIN,
] as const;

export type StellarChain = (typeof STELLAR_CHAINS)[number];

export function isStellarChain(chain: IdentifierString): chain is StellarChain {
    return STELLAR_CHAINS.includes(chain as StellarChain);
}
