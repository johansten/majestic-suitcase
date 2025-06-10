import { createPortal } from 'react-dom';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: any;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (<>
        {createPortal(
            <div className="bg-[#1a334d]/75 fixed inset-0 flex items-center justify-center ">
                <div className="bg-white bg-opacity-100 opacity-100 rounded-lg shadow-xl max-w-md w-full p-6 relative z-50">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
                <div className="text-gray-600">{children}</div>            
                </div>
            </div>,
            document.body)
        }
    </>);
}
