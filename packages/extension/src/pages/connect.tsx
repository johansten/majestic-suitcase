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
}

function Popup() {
    const [dialog, setDialog] = useState<Dialog>({ hostname: '', title: '', id: '' });
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [checks, setChecks] = useState<Set<number>>(new Set());

    useEffect(() => {
        chrome.storage.session.get(['accounts', 'dialog'], (result) => {
            if (result['accounts']) {
                setAccounts(result['accounts']);
            }
            if (result['dialog']) {
                setDialog(result['dialog']);
            }
        });
        chrome.storage.onChanged.addListener((changes, area) => {
            if ((area === 'session') && (changes.accounts?.newValue)) {
                setAccounts(changes.accounts?.newValue);
            }
        });
    }, []);

    // Handle close button click
    async function approve(dialog) {
        const selectedAccounts = accounts.filter((_, index) => checks.has(index));
        await chrome.storage.session.set({
            dialogResponse: {
                id: dialog.id,
                result: selectedAccounts.map(x => x.address)
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
            }
        });
        window.close();
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.pageInfo}>
                    {dialog.title || 'Loading...'} ({dialog.hostname || 'Loading...'}) <br/>
                    wants to connect
                </div>

                {(accounts.length !== 0) && (
                    <div>
                        <div>Accounts</div>
                        {accounts.map((item, index) => (
                            <div>
                            <label key={index}>
                                <input type="checkbox"
                                    value={item.address}
                                    checked = {checks.has(index)}
                                    onChange={() => {
                                        const newChecks = new Set(checks);
                                        if (newChecks.has(index)) {
                                            newChecks.delete(index);
                                        } else {
                                            newChecks.add(index);
                                        }
                                        setChecks(newChecks);
                                    }}
                                />
                                {abbreviate(item.address)}
                            </label>
                            </div>
                        ))}
                    </div>
                )}

                <button style={styles.button} onClick={()=>reject(dialog)}>
                    Cancel
                </button>
                <button style={styles.button} onClick={()=>approve(dialog)}>
                    Connect
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
