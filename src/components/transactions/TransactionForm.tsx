import React, { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { CreateTransactionRequest } from '../../types/transaction';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose }) => {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: CreateTransactionRequest = {
            type,
            amount: parseFloat(amount),
            description,
            transactionDate: new Date().toISOString(),
            currencyCode: 'EUR'
        };

        console.log('Saving', payload);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onClose();
            // In real app, invalidate queries or update list
            setAmount('');
            setDescription('');
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-lg font-bold">Add Transaction</Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <Tab.Group selectedIndex={type === 'INCOME' ? 0 : 1} onChange={(index) => setType(index === 0 ? 'INCOME' : 'EXPENSE')}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
                            {['Income', 'Expense'].map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        clsx(
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white text-primary shadow'
                                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </Tab.List>
                    </Tab.Group>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">€</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="block w-full pl-7 pr-12 sm:text-lg border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">EUR</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                placeholder="What is this for?"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={clsx(
                                    "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    type === 'INCOME' ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                                    loading && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {loading ? 'Saving...' : `Save ${type === 'INCOME' ? 'Income' : 'Expense'}`}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
