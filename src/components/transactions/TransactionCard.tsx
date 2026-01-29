import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { Transaction } from '../../types/transaction';
import { formatDate } from '../../utils/dateUtils';

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
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div className={clsx(
                    "p-2 rounded-full",
                    isExpense
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                )}>
                    {isExpense ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{transaction.description || 'Untitled Transaction'}</h4>
                    <p className="text-xs text-gray-500">
                        {formatDate(transaction.transactionDate)}
                        {isRecurring && <span className="ml-1 text-primary">• Recurring</span>}
                    </p>
                </div>
            </div>

            <div className="text-right">
                <span className={clsx(
                    "text-sm font-bold block",
                    isExpense ? "text-gray-900 dark:text-gray-100" : "text-emerald-600 dark:text-emerald-400"
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
