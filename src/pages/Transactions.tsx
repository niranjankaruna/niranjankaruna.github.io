import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { FilterModal } from '../components/transactions/FilterModal';
import type { FilterType } from '../components/transactions/FilterModal';
import { transactionService } from '../services/api/transactionService';
import type { Transaction } from '../types/transaction';
import { formatDate } from '../utils/dateUtils';

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Filter State
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [dateRange, setDateRange] = useState(() => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 30);

        // Helper to get YYYY-MM-DD in local time
        const toLocalISO = (d: Date) => {
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().split('T')[0];
        };

        return {
            startDate: toLocalISO(start),
            endDate: toLocalISO(end)
        };
    });

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let data: Transaction[];

            // If date range is set, use the specific endpoint
            if (dateRange.startDate && dateRange.endDate) {
                data = await transactionService.getByDateRange(dateRange.startDate, dateRange.endDate);
            } else {
                data = await transactionService.getAll();
            }

            // Filter: Show only Today & Future Transactions
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            data = data.filter(t => {
                const tDate = new Date(t.transactionDate);
                tDate.setHours(0, 0, 0, 0);
                return tDate >= today;
            });

            // Sort by Date Ascending (Nearest/Soonest First)
            data.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());

            setTransactions(data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, [dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleTransactionClick = (id: string) => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            setSelectedTransaction(transaction);
            setIsFormOpen(true);
        }
    };

    const handleAddClick = () => {
        setSelectedTransaction(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        fetchTransactions();
    };

    const handleFilterApply = (filters: { type: FilterType; startDate: string; endDate: string }) => {
        setFilterType(filters.type);
        setDateRange({ startDate: filters.startDate, endDate: filters.endDate });
    };

    const handleFilterClear = () => {
        setFilterType('ALL');
        setDateRange({ startDate: '', endDate: '' });
    };

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Client-side filtering
    const filteredTransactions = transactions.filter(t => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesDescription = t.description?.toLowerCase().includes(query) ?? false;
            const matchesAmount = t.amount.toString().includes(query);
            if (!matchesDescription && !matchesAmount) return false;
        }

        if (filterType === 'ALL') return true;
        return t.type === filterType;
    });

    const isFiltered = filterType !== 'ALL' || (dateRange.startDate && dateRange.endDate);

    return (
        <div className="min-h-screen bg-gray-50 pb-24 transition-colors duration-300">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 space-y-3 transition-colors duration-300">
                <div className="flex items-center">
                    <NavLink to="/" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </NavLink>
                    <h1 className="text-xl font-bold text-gray-900 ml-1">Transactions</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 pl-4 pr-10 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`p-2.5 rounded-xl border transition-colors ${isFiltered
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        title="Filter Transactions"
                    >
                        <FunnelIcon className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleAddClick}
                        className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                        title="Add Transaction"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {([30, 60, 90] as const).map((days) => {
                        // Calculate target date string comparison
                        const today = new Date();
                        const targetDate = new Date();
                        targetDate.setDate(today.getDate() + days);

                        const toLocalISO = (d: Date) => {
                            const offset = d.getTimezoneOffset() * 60000;
                            return new Date(d.getTime() - offset).toISOString().split('T')[0];
                        };

                        const targetDateStr = toLocalISO(targetDate);
                        const isSelected = dateRange.endDate === targetDateStr && dateRange.startDate === toLocalISO(today);

                        return (
                            <button
                                key={days}
                                onClick={() => {
                                    setDateRange({
                                        startDate: toLocalISO(new Date()),
                                        endDate: targetDateStr
                                    });
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${isSelected
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {days} Days
                            </button>
                        );
                    })}

                    {/* Clear Button */}
                    {(dateRange.startDate || dateRange.endDate) && (
                        <button
                            onClick={handleFilterClear}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 whitespace-nowrap"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </header>

            <div className="p-4">
                {isFiltered && (
                    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
                        {filterType !== 'ALL' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {filterType === 'INCOME' ? 'Income' : 'Expense'}
                            </span>
                        )}
                        {dateRange.startDate && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
                            </span>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">No transactions found</p>
                        {isFiltered ? (
                            <p className="text-sm">Try adjusting your filters</p>
                        ) : (
                            <>
                                <p className="text-sm mb-4">Tap the + button to add your first transaction</p>
                                <button
                                    onClick={handleAddClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Add Transaction
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <TransactionList
                        transactions={filteredTransactions}
                        onTransactionClick={handleTransactionClick}
                    />
                )}
            </div>

            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
                initialData={selectedTransaction}
            />

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilters={{
                    type: filterType,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }}
                onApply={handleFilterApply}
            />
        </div>
    );
};

export default Transactions;
