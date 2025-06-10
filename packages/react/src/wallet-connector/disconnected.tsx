import { useState } from 'react'
import type { StellarWallet } from '@majestic-suitcase/core';

import { WalletList } from './wallet-list.js';
import { Modal } from './modal.js'

type DisconnectedProps = {
    onSelected: (arg: StellarWallet) => void;
};

export function Disconnected({ onSelected }: DisconnectedProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (<>
        <button
            className='bg-[#1a334d] px-4 h-12 w-48 rounded-md flex items-center text-lg'
            onClick={openModal}
        >
            Connect Wallet
        </button>

        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Connect a Wallet"
        >
            <WalletList setValue={ onSelected }/>
        </Modal>
    </>)
}
