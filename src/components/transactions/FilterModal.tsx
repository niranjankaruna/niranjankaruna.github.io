import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: {
        type: FilterType;
        startDate: string;
        endDate: string;
    };
    onApply: (filters: { type: FilterType; startDate: string; endDate: string }) => void;
    onClear: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilters, onApply, onClear }) => {
    const [type, setType] = useState<FilterType>(currentFilters.type);
    const [startDate, setStartDate] = useState(currentFilters.startDate);
    const [endDate, setEndDate] = useState(currentFilters.endDate);

    // Sync state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setType(currentFilters.type);
            setStartDate(currentFilters.startDate);
            setEndDate(currentFilters.endDate);
        }
    }, [isOpen, currentFilters]);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onApply({ type, startDate, endDate });
        onClose();
    };

    const handleClear = () => {
        onClear();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-lg font-bold">Filter Transactions</Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleApply} className="space-y-6">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                            <div className="flex rounded-lg bg-gray-100 p-1">
                                {(['ALL', 'INCOME', 'EXPENSE'] as FilterType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={clsx(
                                            'flex-1 py-2 text-sm font-medium rounded-md transition-colors',
                                            type === t
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                        )}
                                    >
                                        {t.charAt(0) + t.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
