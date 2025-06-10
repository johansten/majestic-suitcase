import { registerWallet } from '@wallet-standard/core';

import { StandardWallet } from '../wallets/index.js';
import { sendRequest } from '../messaging.js';

const wallet = new StandardWallet(sendRequest);
registerWallet(wallet);
