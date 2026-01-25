import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, FunnelIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { TransactionList } from '../components/transactions/TransactionList';
import { transactionService } from '../services/api/transactionService';
import type { Transaction } from '../types/transaction';

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await transactionService.getAll();
                setTransactions(data);
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
                setError('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <NavLink to="/" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon className="w-6 h-6" />
                </NavLink>
                <h1 className="text-lg font-bold text-gray-900">Transactions</h1>
                <div className="flex gap-1 -mr-2">
                    <NavLink to="/import" className="p-2 text-gray-600 hover:text-blue-600" title="Import CSV">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                    </NavLink>
                    <button className="p-2 text-gray-600">
                        <FunnelIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">No transactions yet</p>
                        <p className="text-sm">Tap the + button to add your first transaction</p>
                    </div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onTransactionClick={(id) => console.log('View transaction:', id)}
                    />
                )}
            </div>
        </div>
    );
};

export default Transactions;
