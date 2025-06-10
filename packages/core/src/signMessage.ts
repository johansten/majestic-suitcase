import type { WalletAccount } from '@wallet-standard/base';

/** Name of the feature. */
export const StellarSignMessage = 'stellar:signMessage';

/** TODO: docs */
export type StellarSignMessageFeature = {
    /** Name of the feature. */
    readonly [StellarSignMessage]: {
        /** Version of the feature API. */
        readonly version: StellarSignMessageVersion;

        /**
         * Sign messages using the account's secret key.
         *
         * @param inputs Inputs for signing transactions.
         *
         * @return Outputs of signing transactions.
         */
        readonly signMessage: StellarSignMessageMethod;
    };
};

/** Version of the feature. */
export type StellarSignMessageVersion = '1.0.0';

export type StellarSignMessageMethod = (
    ...inputs: readonly StellarSignMessageInput[]
) => Promise<StellarSignMessageOutput[]>;

/** Input for signing a message. */
export type StellarSignMessageInput = {
    readonly account: WalletAccount;
    readonly message: Uint8Array;
};

/** Output of signing a message. */
export type StellarSignMessageOutput = {
    readonly signature: Uint8Array;
};
