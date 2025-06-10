import { useEffect, useRef, useState } from 'react'

import type {
    Wallet,
    WalletAccount,
} from '@wallet-standard/core';

import { DropdownMenu } from './dropdown-menu.js';

function abbreviate(address: string): string {
    if (address.startsWith('0x')) {
        return `${address.slice(0,6)}..${address.slice(-4)}`;
    } else {
        return `${address.slice(0,4)}..${address.slice(-4)}`;
    }
}

type ConnectedProps = {
    wallet: Wallet;
    onDisconnect: () => void;
    onSelected: (arg: WalletAccount) => void;
}

export function Connected({ wallet, onDisconnect, onSelected }: ConnectedProps) {
    const [account, setAccount] = useState<WalletAccount>();
    const [groups, setGroups] = useState<any[]>();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const closeDropdown = () => setIsDropdownOpen(false);

    useEffect(() => {
        setAccount(wallet.accounts[0]);
        setGroups(generateGroups(wallet.accounts, wallet.accounts[0]));
    }, []);

    function onSelectedAccount(accounts: readonly WalletAccount[], account: WalletAccount) {
        onSelected(account);
        setAccount(account);
        setGroups(generateGroups(accounts as any, account));
    }

    function copyAddressToClipboard(x: WalletAccount) {
        navigator.clipboard.writeText(x ? x.address : '');
    }

    function generateGroups(accounts: readonly WalletAccount[], account: WalletAccount) {
        return [
        {
            options: [
                { label: 'Copy address', onSelect: () => copyAddressToClipboard(account) },
            ],
        },
        {
            options: accounts.map(item => (
                {
                    label: abbreviate(item.address),
                    onSelect: () => onSelectedAccount(accounts, item),
                    checked: item === account
                }
            ))
        },
        {
            options: [
                { label: 'Disconnect', onSelect: onDisconnect },
            ],
        },
        ];
    }

    const triggerRef = useRef(null);

    return (
        <> { account && groups && (<>
            <button
                className='bg-[#1a334d] px-4 h-12 w-48 rounded-md flex items-center text-lg'
                onClick={() => {setIsDropdownOpen(!isDropdownOpen)}}
                ref={triggerRef}
            >
                <img className='h-7 w-7 mr-3' src={ wallet.icon }></img>
                { abbreviate(account.address) }
            </button>

            <DropdownMenu
                isOpen={isDropdownOpen}
                onClose={closeDropdown}
                groups={groups}
                triggerRef={triggerRef}
            />
        </>) }
        </>
    )
}
