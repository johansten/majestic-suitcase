import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as stellar from '@stellar/stellar-sdk';
import { bytesToHex, concatBytes, randomBytes } from '@noble/hashes/utils';
import { ed25519 } from '@noble/curves/ed25519';
import { sha256 } from '@noble/hashes/sha2';

import type { WalletAccount } from '@wallet-standard/core';

import {
    StellarSignMessage,
    StellarSignTransaction,
} from '@majestic-suitcase/core';

import {
    useWalletContext,
    WalletConnector,
    WalletProvider,
} from '@majestic-suitcase/react';

import { useToast, ToastProvider } from './toast';

import './index.css'

const networks = {
    'stellar:public': stellar.Networks.PUBLIC,
    'stellar:testnet': stellar.Networks.TESTNET,
    'stellar:futurenet': stellar.Networks.FUTURENET,
    'stellar:sandbox': stellar.Networks.SANDBOX,
    'stellar:standalone': stellar.Networks.STANDALONE
}
networks;

const encoder = new TextEncoder();
const prefix = encoder.encode('Stellar Signed Message:\n');

function verifyMessageSignature(
    account: WalletAccount,
    message: Uint8Array,
    signature: Uint8Array
): boolean {
    const envelope = sha256(concatBytes(prefix, message));
    return ed25519.verify(signature, envelope, account.publicKey as Uint8Array);
}

function verifyTransactionSignature(
    account: WalletAccount,
    tx: stellar.Transaction,
    signature: Uint8Array
): boolean {
    return ed25519.verify(signature, tx.hash(), account.publicKey as Uint8Array)    
}

function App() {

    const context = useWalletContext();
    //  @ts-ignore
    const { addToast } = useToast();

    async function signMesssage() {
        try {
            const message = randomBytes(32);
            const results = await context?.wallet.features[StellarSignMessage].signMessage({
                account: context.account,
                message,
            });

            results?.forEach(result => {
                const isValid = verifyMessageSignature(
                    context?.account!,
                    message,
                    result.signature
                );
                addToast(`0x${bytesToHex(result.signature)}`, isValid ? 'success' : 'error');
            });
        } catch (e){
            console.log(e);
        }
    }

    async function signTransaction() {

        const address = context?.account.address!
        const account = new stellar.Account(address, '0');
        const transaction = new stellar.TransactionBuilder(account, {
                fee: '100',
                networkPassphrase: networks['stellar:public']
            })
            .addOperation(stellar.Operation.payment({
                source: address,
                destination: address,
                amount: '1000',
                asset: stellar.Asset.native()
            }))
            .setTimeout(0)
            .build();

        const tx = Buffer.from(transaction.toXDR(), 'base64');
        const results = await context?.wallet.features[StellarSignTransaction].signTransaction({
            transaction: tx,
            account: context.account,
            chain: 'stellar:public'
        });

        results?.forEach(result => {
            const isValid = verifyTransactionSignature(
                context?.account!,
                transaction,
                result.signature
            );
            addToast(`0x${bytesToHex(result.signature)}`, isValid ? 'success' : 'error');
        })
    }

    function isDisabled(context: any) {
        return context.account === undefined;
    }

    return (
    <>
        <div className='fixed top-2 right-2'>
            <WalletConnector />
        </div>

        <section className="text-white min-h-screen flex items-center justify-center py-12 px-4">
          <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Connect a Standard Wallet and sign away!
            </p>
            <div>
                <button
                    className="bg-blue-600 text-white font-semibold mx-4 py-3 px-6 rounded-md hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isDisabled(context)}
                    onClick={signMesssage}
                >
                Sign a message
                </button>
                <button
                    className="bg-blue-600 text-white font-semibold mx-4 py-3 px-6 rounded-md hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isDisabled(context)}
                    onClick={signTransaction}
                >
                Sign a transaction
                </button>
            </div>
          </div>
        </section>
    </>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WalletProvider>
            <ToastProvider>
                <App/>
            </ToastProvider>
        </WalletProvider>
    </StrictMode>,
)
