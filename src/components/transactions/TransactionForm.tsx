import { useState, useEffect } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { transactionService } from '../../services/api/transactionService';
import { BankAccountSelector } from '../common/BankAccountSelector';
import { CurrencySelector } from '../common/CurrencySelector';
import { TagSelector } from '../common/TagSelector';
import type { Transaction, CreateTransactionRequest, IncomeConfidence, RecurrenceFrequency } from '../../types/transaction';
import type { Currency } from '../../types/settings';
import { currencyService } from '../../services/api/currencyService';
import { CustomSelect } from '../common/CustomSelect';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [currencyCode, setCurrencyCode] = useState('EUR');
    const [bankAccountId, setBankAccountId] = useState<string | undefined>(undefined);
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [endDate, setEndDate] = useState('');

    // Currency logic
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currencySymbol, setCurrencySymbol] = useState('€');

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await currencyService.getAll();
                setCurrencies(data);
            } catch (error) {
                console.error('Failed to load currencies', error);
            }
        };
        fetchCurrencies();
    }, []);

    useEffect(() => {
        const currency = currencies.find(c => c.code === currencyCode);
        if (currency) {
            setCurrencySymbol(currency.symbol);
        }
    }, [currencyCode, currencies]);

    // Income specific
    const [confidence, setConfidence] = useState<IncomeConfidence>('LIKELY');

    // Expense specific
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('MONTHLY');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setType(initialData.type);
                setAmount(initialData.amount.toString());
                setDescription(initialData.description || '');
                setTransactionDate(initialData.transactionDate.split('T')[0]);
                setCurrencyCode(initialData.currencyCode || 'EUR');
                setBankAccountId(initialData.bankAccountId);
                setTagIds(initialData.tagIds || []);

                if (initialData.type === 'INCOME') {
                    setConfidence(initialData.confidence || 'LIKELY');
                } else {
                    setIsRecurring(initialData.isRecurring || false);
                    if (initialData.isRecurring) {
                        setFrequency(initialData.frequency || 'MONTHLY');
                    }
                }
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setCurrencyCode('EUR');
        setBankAccountId(undefined);
        setTagIds([]);
        setConfidence('LIKELY');
        setIsRecurring(false);
        setFrequency('MONTHLY');
        setEndDate('');
        setError(null);
        // Don't reset type, keep user's last choice or default
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
                currencyCode,
                bankAccountId,
                tagIds,
                ...(type === 'INCOME' && { confidence }),
                ...(type === 'EXPENSE' && isRecurring && { isRecurring, frequency, endDate: endDate || undefined }),
                ...(type === 'EXPENSE' && !isRecurring && { isRecurring: false })
            };

            if (initialData) {
                await transactionService.update(initialData.id, payload);
            } else {
                await transactionService.create(payload);
            }

            resetForm();
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error('Failed to save transaction:', err);
            setError('Failed to save transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        setIsDeleting(true);
        try {
            await transactionService.delete(initialData.id);
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error('Failed to delete transaction:', err);
            setError('Failed to delete transaction. Please try again.');
        } finally {
            setIsDeleting(false);
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
                <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-lg font-bold">
                            {initialData ? 'Edit Transaction' : 'Add Transaction'}
                        </Dialog.Title>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!initialData && (
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
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Amount */}
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="block w-full pl-7 pr-3 sm:text-lg border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Currency - New Selector */}
                            <div className="col-span-2 sm:col-span-1 mt-1">
                                <CurrencySelector value={currencyCode} onChange={setCurrencyCode} />
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

                        <div className="grid grid-cols-2 gap-4">
                            {/* Date */}
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2"
                                />
                            </div>

                            {/* Bank Account - New Selector */}
                            <div className="col-span-2 sm:col-span-1">
                                <BankAccountSelector value={bankAccountId} onChange={setBankAccountId} />
                            </div>
                        </div>

                        {/* Tags - New Selector */}
                        <div>
                            <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />
                        </div>

                        {/* Income-specific: Confidence Toggle */}
                        {type === 'INCOME' && (
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Is Guaranteed?</label>
                                    <p className="text-xs text-gray-500">Toggle ON if this income is 100% certain</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfidence(confidence === 'GUARANTEED' ? 'LIKELY' : 'GUARANTEED')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${confidence === 'GUARANTEED' ? 'bg-emerald-600' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${confidence === 'GUARANTEED' ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        )}

                        {/* Expense-specific: Recurring (only for new transactions) */}
                        {type === 'EXPENSE' && !initialData && (
                            <>
                                <div className="flex items-center justify-between py-2">
                                    <label className="text-sm font-medium text-gray-700">Recurring Transaction?</label>
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
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <CustomSelect
                                                    label="Frequency"
                                                    value={frequency}
                                                    onChange={(val) => setFrequency(val as RecurrenceFrequency)}
                                                    options={[
                                                        { label: 'Daily', value: 'DAILY' },
                                                        { label: 'Weekly', value: 'WEEKLY' },
                                                        { label: 'Biweekly', value: 'BIWEEKLY' },
                                                        { label: 'Monthly', value: 'MONTHLY' },
                                                        { label: 'Quarterly', value: 'QUARTERLY' },
                                                        { label: 'Half Yearly', value: 'HALF_YEARLY' },
                                                        { label: 'Yearly', value: 'YEARLY' }
                                                    ]}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">End Date (Opt)</label>
                                                <div className="relative mt-1">
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary border p-2 pr-10"
                                                    />
                                                    {endDate && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEndDate('')}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                            aria-label="Clear end date"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pt-4 flex gap-3">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting || loading}
                                    className="p-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    {isDeleting ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                                    ) : (
                                        <TrashIcon className="h-5 w-5" />
                                    )}
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isDeleting}
                                className={clsx(
                                    "flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    type === 'INCOME' ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                                    (loading || isDeleting) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Saving...
                                    </span>
                                ) : (
                                    initialData ? 'Update Transaction' : `Save ${type === 'INCOME' ? 'Income' : 'Expense'}`
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
