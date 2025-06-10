import React, { useContext, useEffect, useState} from 'react';
import { createPortal } from 'react-dom';

type ToastType = {
    id: string;
    message: string;
    type: string;
}

type ToastProps = ToastType & {
    index: number;
    onClose: (id: string) => void;
}

function Toast({ id, message, type, onClose, index }: ToastProps) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000); // Auto-dismiss after 3 seconds
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
        }[type] || 'bg-gray-500';

    // Stack toasts by adjusting the bottom position based on index
    const bottomPosition = 16 + (index * 60); // Base 16px + 60px per toast

    return (
        <div 
            className={`fixed left-4 right-4 p-4 rounded-lg shadow-lg text-white ${bgColor} flex items-center justify-between transition-all duration-300 ease-in-out`}
            style={{ bottom: `${bottomPosition}px` }}
        >
            <span>{message}</span>
        </div>
    );
}

const ToastContext = React.createContext({});

type ToastProviderProps = {
    children: any;
};

export function ToastProvider({children}: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    function addToast(message: string, type: string) {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }

    function removeToast(id: string) {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }

    const value = {
        addToast
    };

    return (
    <>
        //  @ts-ignore
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
        {createPortal(
            <div className="fixed left-0 p-4">
                {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={removeToast}
                    index={index}
                />
                ))}
            </div>,
            document.body)
        }
    </>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
       throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
