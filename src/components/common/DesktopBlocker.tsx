import React, { useEffect, useState } from 'react';
import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export const DesktopBlocker: React.FC = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth > 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!isLargeScreen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center p-8 text-center text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center space-y-6">
                <div className="relative">
                    <ComputerDesktopIcon className="w-24 h-24 text-gray-400" />
                    <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                        <span className="text-xs font-bold px-1">✕</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold">Mobile Experience Only</h1>
                <p className="text-gray-300">
                    CashFlow is designed to be a native-like mobile app. Please open this on your phone or tablet.
                </p>

                <div className="flex items-center space-x-4 text-blue-400 bg-blue-900/30 px-6 py-3 rounded-xl">
                    <DevicePhoneMobileIcon className="w-6 h-6" />
                    <span className="font-semibold">Designed for Mobile</span>
                </div>
            </div>
        </div>
    );
};
