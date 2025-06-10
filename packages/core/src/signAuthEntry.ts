import type { IdentifierString, WalletAccount } from '@wallet-standard/base';

/** Name of the feature. */
export const StellarSignAuthEntry = 'stellar:signAuthEntry';

/** TODO: docs */
export type StellarSignAuthEntryFeature = {
    /** Name of the feature. */
    readonly [StellarSignAuthEntry]: {
        /** Version of the feature API. */
        readonly version: StellarSignAuthEntryVersion;

        /**
         * Sign AuthEntrys using the account's secret key.
         *
         * @param inputs Inputs for signing AuthEntrys.
         *
         * @return Outputs of signing AuthEntrys.
         */
        readonly signAuthEntry: StellarSignAuthEntryMethod;
    };
};

/** Version of the feature. */
export type StellarSignAuthEntryVersion = '1.0.0';

/** TODO: docs */
//export type StellarAuthEntryVersion = 'legacy' | 0;

/** TODO: docs */
export type StellarSignAuthEntryMethod = (
    ...inputs: readonly StellarSignAuthEntryInput[]
) => Promise<readonly StellarSignAuthEntryOutput[]>;

/** Input for signing a AuthEntry. */
export interface StellarSignAuthEntryInput {
    /** Account to use. */
    readonly account: WalletAccount;

    /** Serialized AuthEntry, as raw bytes. */
    readonly AuthEntry: Uint8Array;

    /** Chain to use. */
    readonly chain?: IdentifierString;

    /** TODO: docs */
    readonly options?: StellarSignAuthEntryOptions;
}

/** Output of signing a AuthEntry. */
export interface StellarSignAuthEntryOutput {
    readonly signature: Uint8Array;
}

/** Options for signing a AuthEntry. */
export type StellarSignAuthEntryOptions = {
};
