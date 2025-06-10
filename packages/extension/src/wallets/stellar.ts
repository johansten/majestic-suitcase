import {
    bytesToHex,
    hexToBytes,
} from '@noble/hashes/utils';

import {
    Wallet,
    WalletAccount,
} from '@wallet-standard/core';

import {
    StellarSignMessageInput,
    StellarSignTransactionInput,
    type StellarSignMessageFeature,
    type StellarSignTransactionFeature,
} from '@majestic-suitcase/core';

import type { SendRequest } from '../messaging.js';

import type { Account } from './types.js';

type Features = StellarSignMessageFeature & StellarSignTransactionFeature;

export class StellarWalletAccount implements WalletAccount {
    readonly #address: string;
    readonly #publicKey: Uint8Array;

    get address() {
        return this.#address;
    }

    get publicKey() {
        return this.#publicKey.slice();
    }

    get chains() {
        return ['stellar:pubnet', 'stellar:testnet', 'stellar:futurenet'] as const;
    }

    get features() {
        return [
            'stellar:signMessage',
            'stellar:signTransaction',
        ] as const;
    }

    constructor(x: Account) {
        if (new.target === StellarWalletAccount) {
            Object.freeze(this);
        }

        this.#address = x.address;
        this.#publicKey = hexToBytes(x.publicKey);
    }
}

export class StellarWallet {

    #sendRequest: SendRequest;

    get features(): Features {
        return {
            'stellar:signMessage': {
                version: '1.0.0',
                signMessage: this.#signMessage
            },
            'stellar:signTransaction': {
                version: '1.0.0',
                signTransaction: this.#signTransaction
            },
        };
    }

    constructor(sendRequest: SendRequest) {
        this.#sendRequest = sendRequest;
    }

    #signMessage = async (x: StellarSignMessageInput): Promise<any[]> => {
        const { account, message } = x;
        const results = await this.#sendRequest({
            hostname: window.location.hostname,
            origin: window.location.origin,
            title: document.title,
            method: 'signMessage',
            params: {
                address: account.address,
                message: bytesToHex(message)
            }
        });

        return results.map(x => ({
            signature: hexToBytes(x.signature),
        }));
    };

    #signTransaction = async (x: StellarSignTransactionInput): Promise<any> => {
        const { account, transaction, chain } = x;

        const results = await this.#sendRequest({
            hostname: window.location.hostname,
            origin: window.location.origin,
            title: document.title,
            method: 'signTransaction',
            params: {
                address: account.address,
                network: chain,
                transaction: bytesToHex(transaction)
            }
        });

        return results.map(x => ({
            signature: hexToBytes(x.signature)
        }));
    };
}
