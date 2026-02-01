import { useState, useMemo } from 'react';
import { BanknotesIcon, ChevronDownIcon, ChevronUpIcon, TagIcon } from '@heroicons/react/24/outline';
import type { BankHoldSummary, TransactionSummary } from '../../types/transaction';
import { formatFriendlyDate } from '../../utils/dateUtils';

interface BankHoldCardProps {
    data: BankHoldSummary[];
    forecastDays: number;
}

interface TagGroup {
    tagName: string;
    transactions: TransactionSummary[];
    total: number;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

// Group transactions by tag (alphabetically)
const groupByTag = (transactions: TransactionSummary[]): TagGroup[] => {
    const groups: Record<string, TransactionSummary[]> = {};

    transactions.forEach(tx => {
        // Use first tag or 'Untagged' if no tags
        const tagName = tx.tagNames && tx.tagNames.length > 0 ? tx.tagNames[0] : 'Untagged';
        if (!groups[tagName]) {
            groups[tagName] = [];
        }
        groups[tagName].push(tx);
    });

    // Convert to array and sort alphabetically
    return Object.entries(groups)
        .map(([tagName, txs]) => ({
            tagName,
            transactions: txs,
            total: txs.reduce((sum, tx) => sum + tx.amount, 0)
        }))
        .sort((a, b) => a.tagName.localeCompare(b.tagName));
};

export const BankHoldCard: React.FC<BankHoldCardProps> = ({ data, forecastDays }) => {
    const [expandedBanks, setExpandedBanks] = useState<Set<string>>(new Set());

    const toggleBank = (bankId: string) => {
        setExpandedBanks(prev => {
            const next = new Set(prev);
            if (next.has(bankId)) {
                next.delete(bankId);
            } else {
                next.add(bankId);
            }
            return next;
        });
    };

    // Memoize tag groups for each bank
    const bankTagGroups = useMemo(() => {
        const result: Record<string, TagGroup[]> = {};
        data.forEach(bank => {
            if (bank.transactions) {
                result[bank.bankAccountId] = groupByTag(bank.transactions);
            }
        });
        return result;
    }, [data]);

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + forecastDays - 1);

    let dateText = `Till ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    if (endDate.toDateString() === today.toDateString()) {
        dateText = "Till Today";
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Balance to Hold</h3>
                    <span className="text-sm text-gray-500">{dateText}</span>
                </div>
                <p className="text-gray-500 text-sm text-center py-4">
                    No expenses with assigned bank accounts in forecast period
                </p>
            </div>
        );
    }

    const totalHold = data.reduce((sum, b) => sum + b.minimumHold, 0);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Balance to Hold</h3>
                <span className="text-sm text-gray-500">{dateText}</span>
            </div>

            <div className="space-y-3">
                {data.map((bank) => {
                    const isExpanded = expandedBanks.has(bank.bankAccountId);
                    const tagGroups = bankTagGroups[bank.bankAccountId] || [];

                    return (
                        <div key={bank.bankAccountId} className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                            {/* Bank Header - Clickable */}
                            <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleBank(bank.bankAccountId)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: bank.color || '#6366f1' }}
                                    >
                                        <BanknotesIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{bank.bankAccountName}</p>
                                        <p className="text-xs text-gray-500">
                                            {bank.expenseCount} upcoming expense{bank.expenseCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">
                                        {formatAmount(bank.minimumHold)}
                                    </p>
                                    {isExpanded ? (
                                        <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expandable Transactions Grouped by Tag */}
                            {isExpanded && tagGroups.length > 0 && (
                                <div className="border-t border-gray-200 bg-white">
                                    {tagGroups.map((group) => (
                                        <div key={`${bank.bankAccountId}-tag-${group.tagName}`} className="border-b border-gray-100 last:border-b-0">
                                            {/* Tag Group Header */}
                                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <TagIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{group.tagName}</span>
                                                    <span className="text-xs text-gray-400">({group.transactions.length})</span>
                                                </div>
                                                <span className="text-sm font-semibold text-red-600">
                                                    -{formatAmount(group.total)}
                                                </span>
                                            </div>

                                            {/* Transactions in this tag group */}
                                            <div className="pl-6">
                                                {group.transactions.map((tx, idx) => (
                                                    <div
                                                        key={`${bank.bankAccountId}-${group.tagName}-tx-${idx}`}
                                                        className="flex justify-between items-center px-4 py-1.5 border-b border-gray-50 last:border-b-0"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">{tx.description}</span>
                                                            {tx.isRecurring && (
                                                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                                    Recurring
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {tx.transactionDate && (
                                                                <span className="text-xs text-gray-400">
                                                                    {formatFriendlyDate(tx.transactionDate)}
                                                                </span>
                                                            )}
                                                            <span className="text-sm text-red-500">
                                                                -{formatAmount(tx.amount)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {data.length > 1 && (
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total to hold</span>
                    <span className="text-lg font-bold text-gray-900">{formatAmount(totalHold)}</span>
                </div>
            )}
        </div>
    );
};
