import React, { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ButtonConfig {
    text: string;
    onClick: () => void;
    color: string; // Tailwind color class
}

interface DynamicPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    buttons: ButtonConfig[];
}

export const DynamicPopup: React.FC<DynamicPopupProps> = ({
    isOpen,
    onClose,
    title,
    children,
    buttons,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                <div className="mb-4 text-neutral-900 dark:text-neutral-100 break-words">
                    {children}
                </div>
                <div className="flex flex-col space-y-2">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            onClick={button.onClick}
                            className={`w-full ${button.color} text-white p-2 rounded-md hover:opacity-90 transition-opacity`}
                        >
                            {button.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
