import {
    StandardConnectFeature,
    StandardDisconnectFeature,
    StandardEventsFeature,
    StandardConnectMethod,
    StandardDisconnectMethod,
    StandardEventsListeners,
    StandardEventsNames,
    StandardEventsOnMethod,
    Wallet,
    WalletAccount,
} from '@wallet-standard/core';

import { WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED, WalletStandardError } from '@wallet-standard/errors';

import type { SendRequest } from '../messaging.js';

import { StellarWalletAccount, StellarWallet } from './stellar.js';

import type { Account } from './types.js';

/*
const accountFactory = {
    ethereum: EthereumWalletAccount,
    solana: SolanaWalletAccount
};
*/

export class StandardWallet implements Wallet {

    #name = 'Standard Wallet';

    #icon = 'data:image/png;base64,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' as const;

    #sendRequest: SendRequest;
    #stellar: StellarWallet;

    #accounts: StellarWalletAccount[] = [];

    readonly #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {};

    get version() {
        return '1.0.0' as const;
    }

    get name() {
        return this.#name;
    }

    get icon() {
        return this.#icon;
    }

    get chains() {
        return [
            'stellar:pubnet', 'stellar:testnet', 'stellar:futurenet'
        ] as const;
    }

    get features(): StandardConnectFeature & StandardDisconnectFeature & StandardEventsFeature {
        return {
            'standard:connect': {
                version: '1.0.0',
                connect: this.#connect,
            },
            'standard:disconnect': {
                version: '1.0.0',
                disconnect: this.#disconnect,
            },
            'standard:events': {
                version: '1.0.0',
                on: this.#on,
            },
//            ...this.#standard.features
            ...this.#stellar.features,
        };
    }

    get accounts() {
        return this.#accounts;
    }

    constructor(sendRequest: SendRequest) {
        if (new.target === StandardWallet) {
            Object.freeze(this);
        }

        this.#stellar = new StellarWallet(sendRequest);
        this.#sendRequest = sendRequest;
    }

    #connect: StandardConnectMethod = async ({ silent } = {}) => {
        silent;

        const accounts = await this.#sendRequest({
            method: 'standard:connect',
            hostname: window.location.hostname,
            origin: window.location.origin,
            title: document.title,
        });

        if (accounts === null) {
            throw new WalletStandardError(WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED);
        }

        this.#accounts = accounts.map((account: Account) => new StellarWalletAccount(account));

        this.#emit('change', { accounts: this.accounts });

        return {
            accounts: this.accounts,
        };
    };

    #disconnect: StandardDisconnectMethod = async () => {
        this.#accounts = [];
    };

    #on: StandardEventsOnMethod = (event, listener) => {
        this.#listeners[event]?.push(listener) || (this.#listeners[event] = [listener]);
        return (): void => this.#off(event, listener);
    };

    #emit<E extends StandardEventsNames>(event: E, ...args: Parameters<StandardEventsListeners[E]>): void {
        // eslint-disable-next-line prefer-spread
        this.#listeners[event]?.forEach((listener) => listener.apply(null, args));
    };

    #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
        this.#listeners[event] = this.#listeners[event]?.filter((existingListener) => listener !== existingListener);
    };
}
