import * as stellar from '@stellar/stellar-sdk';

import {
    concatBytes,
    bytesToHex,
    hexToBytes,
} from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha2';

const encoder = new TextEncoder();
const prefix = encoder.encode('Stellar Signed Message:\n');

import { openDialog } from '../dialog.js';

const keys = [
    stellar.Keypair.random(),
    stellar.Keypair.random(),
    stellar.Keypair.random()
];

const accounts = keys.map(x => ({
    address: x.publicKey(),
    publicKey: x.rawPublicKey().toString('hex'),
}));

chrome.storage.session.set({
    accounts,
});

const networks = {
    'stellar:public': stellar.Networks.PUBLIC,
    'stellar:testnet': stellar.Networks.TESTNET,
    'stellar:futurenet': stellar.Networks.FUTURENET,
    'stellar:sandbox': stellar.Networks.SANDBOX,
    'stellar:standalone': stellar.Networks.STANDALONE
}

async function sign(_message, sender, sendResponse) {

    try {
        await openDialog('sign.html', _message, sender);

        if (_message.data.method === 'signMessage') {
            const { address, message } = _message.data.params;
            const key = keys.filter(x => x.publicKey() === address)[0];
            const envelope = sha256(concatBytes(prefix, hexToBytes(message)));
            const signature = key.sign(Buffer.from(envelope));

            sendResponse({result: [{
                signature: bytesToHex(signature)
            }]});
        }

        if (_message.data.method === 'signTransaction') {
            const { address, transaction, network } = _message.data.params;
            const key = keys.filter(x => x.publicKey() === address)[0];
            const xdr = hexToBytes(transaction);
            const env = stellar.xdr.TransactionEnvelope.fromXDR(Buffer.from(xdr));
            const tx = stellar.TransactionBuilder.fromXDR(env, networks[network]);
            const signature = key.sign(tx.hash());

            sendResponse({result: [{
                signature: bytesToHex(signature)
            }]});
        }
    }

    catch (error) {
        sendResponse({ error: error.message });
    }
}

const connections = new Map();

async function getConnection(message, sender) {
    let result = connections.get(message.data.origin);
    if (!result) {
        result = await openDialog<string[]>('connect.html', message, sender);
        connections.set(message.data.origin, result);
    }

    return result
}

async function connect(message, sender, sendResponse) {
    try {
        const result = await getConnection(message, sender);
        const addresses = new Set(result);
        const filtered = accounts.filter(x => addresses.has(x.address));
        sendResponse({ result: filtered });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'log') {
        console.log(message.args);
    }

    else if (message.type === 'xyzMESSAGE_REQUEST') {
        if (message.data.method === 'standard:connect') {
            connect(message, sender, sendResponse);
        } else {
            sign(message, sender, sendResponse);
        }

        return true;
    }

    return false;
});

console.log('Extension background script loaded');
