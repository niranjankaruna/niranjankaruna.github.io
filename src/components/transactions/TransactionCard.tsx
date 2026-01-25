import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { Transaction } from '../../types/transaction';

interface TransactionCardProps {
    transaction: Transaction;
    currencySymbol?: string;
    onClick?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, currencySymbol, onClick }) => {
    const isExpense = transaction.type === 'EXPENSE';
    const isRecurring = transaction.isRecurring;

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between active:bg-gray-50 transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div className={clsx(
                    "p-2 rounded-full",
                    isExpense ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                )}>
                    {isExpense ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{transaction.description || 'Untitled Transaction'}</h4>
                    <p className="text-xs text-gray-500">
                        {format(parseISO(transaction.transactionDate), 'MMM d, yyyy')}
                        {isRecurring && <span className="ml-1 text-primary">• Recurring</span>}
                    </p>
                </div>
            </div>

            <div className="text-right">
                <span className={clsx(
                    "text-sm font-bold block",
                    isExpense ? "text-gray-900" : "text-emerald-600"
                )}>
                    {isExpense ? '-' : '+'}{currencySymbol || transaction.currencyCode} {Math.abs(transaction.amount).toLocaleString('en-IE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-gray-400 capitalize">
                    {isExpense ? 'Paid' : (transaction.confidence?.toLowerCase() || 'Pending')}
                </span>
            </div>
        </div>
    );
};
