import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { SafeModeToggle } from '../components/dashboard/SafeModeToggle';
import { transactionService, forecastService } from '../services/api/transactionService';
import { useSettings } from '../contexts/SettingsContext';
import type { Transaction } from '../types/transaction';

const Dashboard = () => {
    const { user } = useAuthStore();
    const { settings } = useSettings();
    const [safeMode, setSafeMode] = useState(false);
    const [balance, setBalance] = useState(0);
    const [safeToSpend, setSafeToSpend] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Set default safe mode from settings
    useEffect(() => {
        setSafeMode(settings.defaultSafeMode);
    }, [settings.defaultSafeMode]);

    // Fetch forecast and transactions
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch forecast
                const forecastData = await forecastService.getForecast(
                    settings.forecastPeriod,
                    safeMode,
                    0 // starting balance - could be fetched from user settings
                );
                setBalance(forecastData.currentBalance);
                setSafeToSpend(forecastData.safeToSpend);

                // Fetch recent transactions
                const transactions = await transactionService.getAll();
                // Get last 5 transactions
                setRecentTransactions(transactions.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load data');
                // Set defaults on error
                setBalance(0);
                setSafeToSpend(0);
                setRecentTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [safeMode, settings.forecastPeriod]);

    const formatAmount = (amount: number, type: string) => {
        const formatted = new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(Math.abs(amount));
        return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-xs text-gray-500">Welcome, {user?.email?.split('@')[0]}</p>
                    </div>
                    <Link to="/settings" className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold hover:bg-blue-200 transition-colors">
                        {user?.email?.[0].toUpperCase()}
                    </Link>
                </div>
            </header>

            <div className="p-4 space-y-4">
                <SafeModeToggle enabled={safeMode} onChange={setSafeMode} />

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : (
                    <>
                        <BalanceCard
                            balance={balance}
                            safeToSpend={safeToSpend}
                        />

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                                <Link to="/transactions" className="text-xs text-primary font-medium">View All</Link>
                            </div>

                            {recentTransactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-sm">No transactions yet</p>
                                    <p className="text-xs mt-1">Tap the + button to add your first transaction</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-full ${transaction.type === 'EXPENSE'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {transaction.type === 'EXPENSE' ? '💸' : '💰'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {transaction.description || (transaction.type === 'INCOME' ? 'Income' : 'Expense')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(transaction.transactionDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold ${transaction.type === 'EXPENSE' ? 'text-gray-900' : 'text-green-600'
                                                }`}>
                                                {formatAmount(transaction.amount, transaction.type)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
