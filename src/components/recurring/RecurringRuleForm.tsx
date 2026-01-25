import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { recurringRuleService } from '../../services/api/recurringRuleService';
import { BankAccountSelector } from '../common/BankAccountSelector';
import { CurrencySelector } from '../common/CurrencySelector';
import { TagSelector } from '../common/TagSelector';
import type { RecurringRule, CreateRecurringRuleRequest } from '../../types/recurringRule';
import type { TransactionType, RecurrenceFrequency } from '../../types/transaction';

interface RecurringRuleFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: RecurringRule | null;
}

export const RecurringRuleForm: React.FC<RecurringRuleFormProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('MONTHLY');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [currencyCode, setCurrencyCode] = useState('EUR');
    const [bankAccountId, setBankAccountId] = useState<string | undefined>(undefined);
    const [tagIds, setTagIds] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setDescription(initialData.description);
                setAmount(initialData.amount.toString());
                setType(initialData.type);
                setFrequency(initialData.frequency);
                setStartDate(initialData.startDate);
                setEndDate(initialData.endDate || '');
                setCurrencyCode(initialData.currencyCode);
                setBankAccountId(initialData.bankAccountId);
                setTagIds(initialData.tagIds || []);
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setType('EXPENSE');
        setFrequency('MONTHLY');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setCurrencyCode('EUR');
        setBankAccountId(undefined);
        setTagIds([]);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: CreateRecurringRuleRequest = {
                description,
                amount: parseFloat(amount),
                type,
                frequency,
                startDate,
                endDate: endDate || undefined,
                currencyCode,
                bankAccountId,
                tagIds,
                active: true
            };

            if (initialData) {
                await recurringRuleService.update(initialData.id, payload);
            } else {
                await recurringRuleService.create(payload);
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            console.error(err);
            setError('Failed to save rule');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-lg font-bold">
                            {initialData ? 'Edit Recurring Rule' : 'New Recurring Rule'}
                        </Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as TransactionType)}
                                className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                                />
                            </div>
                            <div className="col-span-1">
                                <CurrencySelector value={currencyCode} onChange={setCurrencyCode} className="mt-0" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
                                className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                            >
                                <option value="WEEKLY">Weekly</option>
                                <option value="BIWEEKLY">Biweekly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date (Opt)</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                                />
                            </div>
                        </div>

                        <BankAccountSelector value={bankAccountId} onChange={setBankAccountId} />
                        <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            {loading ? 'Saving...' : 'Save Rule'}
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
