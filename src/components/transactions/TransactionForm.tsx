import { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { transactionService } from '../../services/api/transactionService';
import type { CreateTransactionRequest, IncomeConfidence, RecurrenceFrequency } from '../../types/transaction';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSuccess }) => {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [confidence, setConfidence] = useState<IncomeConfidence>('LIKELY');
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('MONTHLY');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setConfidence('LIKELY');
        setIsRecurring(false);
        setFrequency('MONTHLY');
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: CreateTransactionRequest = {
                type,
                amount: parseFloat(amount),
                description,
                transactionDate,
                currencyCode: 'EUR',
                ...(type === 'INCOME' && { confidence }),
                ...(type === 'EXPENSE' && isRecurring && { isRecurring, frequency })
            };

            await transactionService.create(payload);

            resetForm();
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error('Failed to create transaction:', err);
            setError('Failed to save transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-lg font-bold">Add Transaction</Dialog.Title>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

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
                        {/* Amount */}
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
                                    min="0.01"
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

                        {/* Description */}
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

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                required
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                            />
                        </div>

                        {/* Income-specific: Confidence */}
                        {type === 'INCOME' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confidence Level</label>
                                <select
                                    value={confidence}
                                    onChange={(e) => setConfidence(e.target.value as IncomeConfidence)}
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                >
                                    <option value="GUARANTEED">Guaranteed</option>
                                    <option value="LIKELY">Likely</option>
                                </select>
                            </div>
                        )}

                        {/* Expense-specific: Recurring */}
                        {type === 'EXPENSE' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Recurring</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsRecurring(!isRecurring)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRecurring ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {isRecurring && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                                        <select
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
                                            className="mt-1 block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                        >
                                            <option value="DAILY">Daily</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="BIWEEKLY">Biweekly</option>
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="QUARTERLY">Quarterly</option>
                                            <option value="HALF_YEARLY">Half Yearly</option>
                                            <option value="YEARLY">Yearly</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

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
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Saving...
                                    </span>
                                ) : (
                                    `Save ${type === 'INCOME' ? 'Income' : 'Expense'}`
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
