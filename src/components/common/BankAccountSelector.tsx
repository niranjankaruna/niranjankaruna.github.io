import { useState, useEffect } from 'react';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { bankAccountService } from '../../services/api/bankAccountService';
import type { BankAccount } from '../../types/settings';

interface BankAccountSelectorProps {
    value?: string;
    onChange: (accountId: string) => void;
    className?: string;
}

export const BankAccountSelector: React.FC<BankAccountSelectorProps> = ({ value, onChange, className }) => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await bankAccountService.getAll();
                setAccounts(data);
                // Select default if no value provided
                if (!value && data.length > 0) {
                    const defaultAccount = data.find(a => a.isDefault) || data[0];
                    onChange(defaultAccount.id);
                }
            } catch (error) {
                console.error('Failed to load bank accounts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if (loading) return <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} ({account.currencyCode})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
