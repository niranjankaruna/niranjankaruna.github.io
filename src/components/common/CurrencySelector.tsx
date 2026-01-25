import { useState, useEffect } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { currencyService } from '../../services/api/currencyService';
import type { Currency } from '../../types/settings';

interface CurrencySelectorProps {
    value: string;
    onChange: (currencyCode: string) => void;
    className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, className }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await currencyService.getAll();
                setCurrencies(data);
            } catch (error) {
                console.error('Failed to load currencies', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, []);

    if (loading) return <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BanknotesIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full pl-10 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
