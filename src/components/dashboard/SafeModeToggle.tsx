import React from 'react';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

interface SafeModeToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export const SafeModeToggle: React.FC<SafeModeToggleProps> = ({ enabled, onChange }) => {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center space-x-3">
                <div className={clsx("p-2 rounded-lg", enabled ? "bg-emerald-100" : "bg-gray-100")}>
                    <ShieldCheckIcon className={clsx("w-6 h-6", enabled ? "text-emerald-600" : "text-gray-400")} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Safe Mode</h3>
                    <p className="text-xs text-gray-500">Only count guaranteed income</p>
                </div>
            </div>

            <Switch
                checked={enabled}
                onChange={onChange}
                className={clsx(
                    enabled ? 'bg-emerald-500' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                )}
            >
                <span
                    aria-hidden="true"
                    className={clsx(
                        enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
        </div>
    );
};
