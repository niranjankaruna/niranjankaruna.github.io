import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, FunnelIcon, ArrowUpTrayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { FilterModal } from '../components/transactions/FilterModal';
import type { FilterType } from '../components/transactions/FilterModal';
import { transactionService } from '../services/api/transactionService';
import type { Transaction } from '../types/transaction';

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Filter State
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
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
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center">
                    <NavLink to="/" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </NavLink>
                    <h1 className="text-lg font-bold text-gray-900 ml-2">Transactions</h1>
                </div>
                <div className="flex gap-1 -mr-2">
                    <div className="relative mr-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-32 py-1 pl-2 pr-8 text-sm border-b border-gray-300 focus:outline-none focus:border-primary bg-transparent transition-all focus:w-40"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-0 top-1 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <NavLink to="/import" className="p-2 text-gray-600 hover:text-blue-600" title="Import CSV">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                    </NavLink>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`p-2 ${isFiltered ? 'text-primary' : 'text-gray-600'}`}
                        title="Filter Transactions"
                    >
                        <FunnelIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleAddClick}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Add Transaction"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                            </span>
                        )}
                        <button
                            onClick={handleFilterClear}
                            className="text-xs text-blue-600 font-medium hover:text-blue-800 whitespace-nowrap"
                        >
                            Clear All
                        </button>
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
                onClear={handleFilterClear}
            />
        </div>
    );
};

export default Transactions;
