import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { bankAccountService } from '../../services/api/bankAccountService';
import { currencyService } from '../../services/api/currencyService';
import type { BankAccount, CreateBankAccountRequest, Currency } from '../../types/settings';

export const BankAccountSettings = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState<CreateBankAccountRequest>({
        name: '',
        accountType: 'CHECKING',
        accountNumber: '',
        currencyCode: 'EUR',
        currentBalance: 0,
        isDefault: false,
        color: '#3B82F6'
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [accountsData, currenciesData] = await Promise.all([
                bankAccountService.getAll(),
                currencyService.getAll()
            ]);
            setAccounts(accountsData);
            setCurrencies(currenciesData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load bank accounts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await bankAccountService.create(newAccount);
            setIsAdding(false);
            setNewAccount({
                name: '',
                accountType: 'CHECKING',
                accountNumber: '',
                currencyCode: 'EUR',
                currentBalance: 0,
                isDefault: false,
                color: '#3B82F6'
            });
            fetchData();
        } catch (err) {
            console.error('Failed to add account:', err);
            setError('Failed to add account');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await bankAccountService.delete(id);
            fetchData();
        } catch (err) {
            console.error('Failed to delete account:', err);
            setError('Failed to delete account');
        }
    };

    // Note: Set default would likely be an update call in a real scenario, handled by update()
    // For now we just show the badge

    if (loading && accounts.length === 0) return <div className="text-center py-4">Loading accounts...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <BuildingLibraryIcon className="w-6 h-6" /> Bank Accounts
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 text-primary hover:bg-blue-50 rounded-full"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAddAccount} className="mb-6 bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Account Name"
                            required
                            value={newAccount.name}
                            onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <select
                            value={newAccount.accountType}
                            onChange={e => setNewAccount({ ...newAccount, accountType: e.target.value })}
                            className="p-2 border rounded"
                        >
                            <option value="CHECKING">Checking</option>
                            <option value="SAVINGS">Savings</option>
                            <option value="CREDIT">Credit Card</option>
                            <option value="CASH">Cash</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Account Number (Last 4)"
                            maxLength={4}
                            value={newAccount.accountNumber || ''}
                            onChange={e => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <select
                            value={newAccount.currencyCode}
                            onChange={e => setNewAccount({ ...newAccount, currencyCode: e.target.value })}
                            className="p-2 border rounded"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.code}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Current Balance"
                            required
                            step="0.01"
                            value={newAccount.currentBalance}
                            onChange={e => setNewAccount({ ...newAccount, currentBalance: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded"
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
                            Add Account
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {accounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: account.color || '#3B82F6' }}
                            >
                                {account.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    {account.name}
                                    {account.isDefault && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Default</span>}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {account.accountType} • {account.currencyCode} {account.currentBalance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(account.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
