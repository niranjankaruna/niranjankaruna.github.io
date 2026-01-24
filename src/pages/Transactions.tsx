import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { TransactionList } from '../components/transactions/TransactionList';
import type { Transaction } from '../types/transaction';

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        const mockData: Transaction[] = [
            {
                id: '1',
                type: 'INCOME',
                amount: 4500.00,
                currencyCode: 'EUR',
                amountInBaseCurrency: 4500.00,
                description: 'Monthly Salary',
                transactionDate: new Date().toISOString(),
                confidence: 'GUARANTEED'
            },
            {
                id: '2',
                type: 'EXPENSE',
                amount: 15.99,
                currencyCode: 'EUR',
                amountInBaseCurrency: 15.99,
                description: 'Netflix Subscription',
                transactionDate: new Date().toISOString(),
                isRecurring: true,
                frequency: 'MONTHLY'
            },
            {
                id: '3',
                type: 'EXPENSE',
                amount: 1200.00,
                currencyCode: 'EUR',
                amountInBaseCurrency: 1200.00,
                description: 'Apartment Rent',
                transactionDate: new Date().toISOString(),
                isRecurring: true,
                frequency: 'MONTHLY'
            }
        ];

        setTimeout(() => {
            setTransactions(mockData);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <NavLink to="/" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon className="w-6 h-6" />
                </NavLink>
                <h1 className="text-lg font-bold text-gray-900">Transactions</h1>
                <button className="p-2 -mr-2 text-gray-600">
                    <FunnelIcon className="w-6 h-6" />
                </button>
            </header>

            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onTransactionClick={(id) => console.log('View', id)}
                    />
                )}
            </div>
        </div>
    );
};

export default Transactions;
