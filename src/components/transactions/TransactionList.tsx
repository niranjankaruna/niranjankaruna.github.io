import React from 'react';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../../types/transaction';

interface TransactionListProps {
    transactions: Transaction[];
    onTransactionClick?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onTransactionClick }) => {
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
                    onClick={() => onTransactionClick?.(t.id)}
                />
            ))}
        </div>
    );
};
