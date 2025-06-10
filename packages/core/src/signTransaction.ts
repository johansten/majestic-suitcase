import type { IdentifierString, WalletAccount } from '@wallet-standard/base';
import type { StellarChain } from './chains.js';

/** Name of the feature. */
export const StellarSignTransaction = 'stellar:signTransaction';

/** TODO: docs */
export type StellarSignTransactionFeature = {
    /** Name of the feature. */
    readonly [StellarSignTransaction]: {
        /** Version of the feature API. */
        readonly version: StellarSignTransactionVersion;

        /**
         * Sign transactions using the account's secret key.
         *
         * @param inputs Inputs for signing transactions.
         *
         * @return Outputs of signing transactions.
         */
        readonly signTransaction: StellarSignTransactionMethod;
    };
};

/** Version of the feature. */
export type StellarSignTransactionVersion = '1.0.0';

/** TODO: docs */
export type StellarSignTransactionMethod = (
    ...inputs: readonly StellarSignTransactionInput[]
) => Promise<readonly StellarSignTransactionOutput[]>;

/** Input for signing a transaction. */
export interface StellarSignTransactionInput {
    /** Account to use. */
    readonly account: WalletAccount;

    /** Serialized transaction, as raw bytes. */
    readonly transaction: Uint8Array;

    /** Chain to use. */
//    readonly chain?: IdentifierString;
    readonly chain?: StellarChain;

    /** TODO: docs */
    readonly options?: StellarSignTransactionOptions;
}

/** Output of signing a transaction. */
export interface StellarSignTransactionOutput {
    readonly signature: Uint8Array;
}

/** Options for signing a transaction. */
export type StellarSignTransactionOptions = {
};
