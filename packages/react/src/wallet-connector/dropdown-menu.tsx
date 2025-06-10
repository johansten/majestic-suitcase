import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type groupItem = {
    label: string;
    onSelect: () => void;
    checked?: boolean;
}

type DropdownMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    groups: {
        options: groupItem[]
    }[];
    triggerRef: any;
}

export function DropdownMenu({ isOpen, onClose, groups, triggerRef }: DropdownMenuProps) {
    if (!isOpen) return null;

    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Calculate trigger position
    useEffect(() => {
        function updatePosition() {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY, // Below trigger
                    left: rect.left + window.scrollX, // Aligned with trigger's left
                });
            }
        }

        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition)
        }
    }, [isOpen, triggerRef.current]);

    return (<>
        { triggerRef.current && createPortal(
            <div
                className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl z-50"
                style={{ top: `${position.top}px`, left: `${position.left}px` }}
            >
                <ul className="py-2">
                {groups.map((group, groupIndex) => (
                    <li key={`group-${groupIndex}`}>
                    {group.options.map((option, optionIndex) => (
                        <button
                        key={`option-${groupIndex}-${optionIndex}`}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                        onClick={() => {
                            option.onSelect();
                            onClose();
                        }}
                        >
                        {option.checked && (
                            <span className="mr-2 text-green-500">✓</span>
                        )}
                        {option.label}
                        </button>
                    ))}
                    {groupIndex < groups.length - 1 && (
                        <div className="border-t border-gray-200 my-1"></div>
                    )}
                    </li>
                ))}
                </ul>
            </div>,
            document.body)
        }
    </>);
}
