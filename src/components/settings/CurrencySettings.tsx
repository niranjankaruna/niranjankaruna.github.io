import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon, StarIcon, BanknotesIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { currencyService } from '../../services/api/currencyService';
import type { Currency, CreateCurrencyRequest } from '../../types/settings';

interface CurrencySettingsProps {
    onDataChange?: () => void;
}

export const CurrencySettings: React.FC<CurrencySettingsProps> = ({ onDataChange }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
    const [newCurrency, setNewCurrency] = useState<CreateCurrencyRequest>({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: 1.0,
        isBaseCurrency: false
    });

    const fetchCurrencies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await currencyService.getAll();
            setCurrencies(data);
        } catch (err) {
            console.error('Failed to fetch currencies:', err);
            setError('Failed to load currencies');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    const handleAddCurrency = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await currencyService.create(newCurrency);
            setIsAdding(false);
            setNewCurrency({ code: '', name: '', symbol: '', exchangeRate: 1.0, isBaseCurrency: false });
            fetchCurrencies();
            onDataChange?.();
        } catch (err) {
            console.error('Failed to add currency:', err);
            setError('Failed to add currency');
        }
    };

    const handleUpdateCurrency = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCurrency) return;

        try {
            await currencyService.update(editingCurrency.id, {
                code: editingCurrency.code,
                name: editingCurrency.name,
                symbol: editingCurrency.symbol,
                exchangeRate: editingCurrency.exchangeRate,
                isBaseCurrency: editingCurrency.isBaseCurrency
            });
            setEditingCurrency(null);
            fetchCurrencies();
            onDataChange?.();
        } catch (err) {
            console.error('Failed to update currency:', err);
            setError('Failed to update currency');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this currency?')) return;
        try {
            await currencyService.delete(id);
            fetchCurrencies();
            onDataChange?.();
        } catch (err) {
            console.error('Failed to delete currency:', err);
            setError('Failed to delete currency');
        }
    };

    const handleSetBase = async (id: string) => {
        try {
            await currencyService.setBaseCurrency(id);
            fetchCurrencies();
            onDataChange?.();
        } catch (err) {
            console.error('Failed to set base currency:', err);
            setError('Failed to set base currency');
        }
    };

    if (loading && currencies.length === 0) return <div className="text-center py-4">Loading currencies...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <BanknotesIcon className="w-6 h-6" /> Currencies
                </h2>
                {!editingCurrency && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-full"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAddCurrency} className="mb-6 bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">Add New Currency</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Code (e.g. USD)"
                            required
                            maxLength={3}
                            value={newCurrency.code}
                            onChange={e => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Symbol (e.g. $)"
                            required
                            value={newCurrency.symbol}
                            onChange={e => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name (e.g. US Dollar)"
                            required
                            value={newCurrency.name}
                            onChange={e => setNewCurrency({ ...newCurrency, name: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Exchange Rate (vs Base)"
                            required
                            step="0.000001"
                            value={newCurrency.exchangeRate}
                            onChange={e => setNewCurrency({ ...newCurrency, exchangeRate: parseFloat(e.target.value) })}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1 text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-primary text-white rounded"
                        >
                            Add
                        </button>
                    </div>
                </form>
            )}

            {editingCurrency && (
                <form onSubmit={handleUpdateCurrency} className="mb-6 bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100">
                    <h3 className="font-medium text-blue-900 border-b border-blue-200 pb-2">Edit Currency</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Code"
                            disabled
                            value={editingCurrency.code}
                            className="p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <input
                            type="text"
                            placeholder="Symbol"
                            required
                            value={editingCurrency.symbol}
                            onChange={e => setEditingCurrency({ ...editingCurrency, symbol: e.target.value })}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            value={editingCurrency.name}
                            onChange={e => setEditingCurrency({ ...editingCurrency, name: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Exchange Rate"
                            required
                            step="0.000001"
                            disabled={editingCurrency.isBaseCurrency}
                            value={editingCurrency.exchangeRate}
                            onChange={e => setEditingCurrency({ ...editingCurrency, exchangeRate: parseFloat(e.target.value) })}
                            className={`p-2 border rounded ${editingCurrency.isBaseCurrency ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditingCurrency(null)}
                            className="px-3 py-1 text-gray-600 hover:bg-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-primary text-white rounded shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {currencies.map(currency => (
                    <div key={currency.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded shadow-sm text-sm font-bold w-10 text-center">
                                {currency.symbol}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{currency.code}</h4>
                                <p className="text-xs text-gray-500">{currency.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right mr-2 hidden sm:block">
                                <p className="text-sm font-medium">{currency.exchangeRate.toFixed(4)}</p>
                                <p className="text-xs text-gray-400">Rate</p>
                            </div>
                            <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => handleSetBase(currency.id)}
                                    title={currency.isBaseCurrency ? "Base Currency" : "Set as Base"}
                                    disabled={currency.isBaseCurrency}
                                    className={`p-2 transition-colors ${currency.isBaseCurrency ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-50'}`}
                                >
                                    {currency.isBaseCurrency ? <StarIconSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
                                </button>
                                <div className="w-px bg-gray-100"></div>
                                <button
                                    onClick={() => {
                                        setEditingCurrency(currency);
                                        setIsAdding(false);
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors"
                                    title="Edit"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                {!currency.isBaseCurrency && (
                                    <>
                                        <div className="w-px bg-gray-100"></div>
                                        <button
                                            onClick={() => handleDelete(currency.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
