import { useState, useEffect } from 'react';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../../types/transaction';
import { currencyService } from '../../services/api/currencyService';


interface TransactionListProps {
    transactions: Transaction[];
    onTransactionClick?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onTransactionClick }) => {
    const [currencyMap, setCurrencyMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const data = await currencyService.getAll();
                const map: Record<string, string> = {};
                data.forEach(c => map[c.code] = c.symbol);
                setCurrencyMap(map);
            } catch (err) {
                console.error('Failed to load currencies in list', err);
            }
        };
        loadCurrencies();
    }, []);

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No transactions found</p>
            </div>
        );
    }

    // Group by date logic could go here, but simple list for now
    return (
        <div className="space-y-3">
            {transactions.map((t) => (
                <TransactionCard
                    key={t.id}
                    transaction={t}
                    currencySymbol={currencyMap[t.currencyCode] || t.currencyCode}
                    onClick={() => onTransactionClick?.(t.id)}
                />
            ))}
        </div>
    );
};
