import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { Account } from '../wallets/types.js';

console.log = (...args) => {
    chrome.runtime.sendMessage({ type: 'log', args: args });
};

function abbreviate(address: string): string {
    if (address.startsWith('0x')) {
        return `${address.slice(0,6)}..${address.slice(-4)}`;
    } else {
        return `${address.slice(0,4)}..${address.slice(-4)}`;
    }
}


type Dialog = {
    id: string;
    hostname: string;
    title: string;
    method: string;
    params: {
        address: string;
        message: string;
    }
}

function Popup() {
    const [dialog, setDialog] = useState<Dialog>();

    useEffect(() => {
        chrome.storage.session.get(['dialog'], (result) => {
            if (result['dialog']) {
                setDialog(result['dialog']);
            }
        });
    }, []);

    // Handle close button click
    async function approve(dialog) {
        await chrome.storage.session.set({
            dialogResponse: {
                id: dialog.id,
                result: null
            },
        });
        window.close();
    }

    async function reject(dialog) {
        await chrome.storage.session.set({
            dialogResponse: {
                id: dialog.id,
                error: {
                    message: 'User rejected'
                }
            },
        });
        window.close();
    }

    const content = {
        'signMessage': 'message',
        'signTransaction': 'transaction',
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                { dialog && <><div style={styles.pageInfo}>
                    {dialog.title || 'Loading...'} ({dialog.hostname || 'Loading...'}) <br/>
                    wants you to sign a {content[dialog.method]} using the account
                </div>
                <p>{abbreviate(dialog.params.address)}</p></>
                }

                <button style={styles.button} onClick={()=>reject(dialog)}>
                    Reject
                </button>
                <button style={styles.button} onClick={()=>approve(dialog)}>
                    Approve
                </button>
            </div>
        </div>
    );
}

// Inline styles for minimal example
const styles = {
    container: {
        width: '300px',
        height: '512px',
        margin: 0,
        padding: 0,
        fontFamily: 'Arial, sans-serif',
    },
    titleBar: {
        background: '#333',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        padding: '10px',
        'text-align': 'center',
    },
    pageInfo: {
        fontSize: '12px',
        marginBottom: '10px',
        'word-break': 'break-all',
    },
    button: {
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
    },
};

// Render the React app
const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
