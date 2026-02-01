import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { SafeModeToggle } from '../components/dashboard/SafeModeToggle';
import { BankHoldCard } from '../components/dashboard/BankHoldCard';
import { transactionService, forecastService } from '../services/api/transactionService';
import { useSettings } from '../contexts/SettingsContext';
import { formatDate, toLocalISOString } from '../utils/dateUtils';
import type { Transaction, DailyBreakdown, BankHoldSummary } from '../types/transaction';

const Dashboard = () => {
    const { user } = useAuthStore();
    const { settings, loading: settingsLoading } = useSettings();
    const [safeMode, setSafeMode] = useState(false);
    const [balance, setBalance] = useState(0); // This will now serve as projectedBalance
    const [startingBalance, setStartingBalance] = useState(0);
    const [safeToSpend, setSafeToSpend] = useState(0);
    const [dailyForecasts, setDailyForecasts] = useState<DailyBreakdown[]>([]);
    const [bankHoldSummary, setBankHoldSummary] = useState<BankHoldSummary[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Set default safe mode from settings
    useEffect(() => {
        if (!settingsLoading) {
            setSafeMode(settings?.defaultSafeMode ?? false);
        }
    }, [settings?.defaultSafeMode, settingsLoading]);

    // Fetch forecast and transactions
    useEffect(() => {
        // Wait for settings to load
        if (settingsLoading) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Sync recurring transactions first - REMOVED (User requested manual sync only)
                // try {
                //     await transactionService.syncProjections();
                // } catch (err) {
                //     console.error('Failed to sync projections:', err);
                // }

                // Fetch forecast - use defaults if settings not available
                const forecastPeriod = settings?.forecastPeriod ?? 30;

                try {
                    const forecastData = await forecastService.getForecast(
                        forecastPeriod,
                        safeMode,
                        undefined, // Let backend calculate from transaction history
                        toLocalISOString(new Date())
                    );
                    setStartingBalance(forecastData?.startingBalance ?? 0);
                    setBalance(forecastData?.projectedBalance ?? 0);
                    setSafeToSpend(forecastData?.safeToSpend ?? 0);
                    setDailyForecasts(forecastData?.dailyBreakdown ?? []);
                    setBankHoldSummary(forecastData?.bankHoldSummary ?? []);

                    // Fix: Use End-of-Day balance from the first day (Today) as Current Balance
                    // startingBalance from backend is "Opening Balance"
                    if (forecastData?.dailyBreakdown && forecastData.dailyBreakdown.length > 0) {
                        // Fallback to startingBalance (Opening) if closingBalance is 0 (suspect) and startingBalance is positive
                        const endOfDayBalance = forecastData.dailyBreakdown[0].closingBalance;
                        const openingBalance = forecastData.startingBalance ?? 0;

                        // Use End-of-Day if available and non-zero, OR if it's genuinely 0 but Opening was also 0
                        // Use Opening if End-of-Day is 0 but Opening was > 0 (implies calculation error or missing data)
                        if (endOfDayBalance === 0 && openingBalance > 0) {
                            setStartingBalance(openingBalance);
                        } else {
                            setStartingBalance(endOfDayBalance);
                        }
                    } else {
                        setStartingBalance(forecastData?.startingBalance ?? 0);
                    }
                } catch (forecastErr) {
                    console.error('Failed to fetch forecast:', forecastErr);
                    setStartingBalance(0);
                    setBalance(0);
                    setDailyForecasts([]);
                    setBankHoldSummary([]);
                }

                // Fetch recent transactions
                try {
                    const transactions = await transactionService.getAll();

                    // Filter: Show only Today & Future
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const upcomingTransactions = transactions.filter((t: Transaction) => {
                        const tDate = new Date(t.transactionDate);
                        tDate.setHours(0, 0, 0, 0);
                        return tDate >= today;
                    });

                    // Sort Ascending (Nearest/Soonest First)
                    upcomingTransactions.sort((a: Transaction, b: Transaction) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
                    setRecentTransactions(Array.isArray(upcomingTransactions) ? upcomingTransactions.slice(0, 5) : []);
                } catch (txErr) {
                    console.error('Failed to fetch transactions:', txErr);
                    setRecentTransactions([]);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load data');
                setStartingBalance(0);
                setBalance(0);
                setSafeToSpend(0);
                setRecentTransactions([]);
                setDailyForecasts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [safeMode, settings?.forecastPeriod, settingsLoading]);

    const formatAmount = (amount: number, type: string) => {
        const formatted = new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR'
        }).format(Math.abs(amount));
        return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
    };

    const formatDateDisplay = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        // Use standard format
        return formatDate(date);
    };

    // Show loading while settings are loading
    if (settingsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10 transition-colors duration-300">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-xs text-gray-500">Welcome, {user?.email?.split('@')[0] ?? 'User'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/reminders" className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <BellAlertIcon className="h-6 w-6" />
                        </Link>
                        <Link to="/settings" className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold hover:bg-blue-200 transition-colors">
                            {user?.email?.[0]?.toUpperCase() ?? 'U'}
                        </Link>
                    </div>
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
                            startingBalance={startingBalance}
                            projectedBalance={balance}
                            safeToSpend={safeToSpend}
                            forecastDays={settings?.forecastPeriod ?? 30}
                        />

                        {/* Bank Hold Summary */}
                        <BankHoldCard
                            data={bankHoldSummary}
                            forecastDays={settings?.forecastPeriod ?? 30}
                        />

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl p-4 shadow-sm transition-colors duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900">Transactions</h3>
                                <Link to="/transactions" className="text-xs text-primary font-medium hover:text-blue-400">View All</Link>
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
                                                        {formatDateDisplay(transaction.transactionDate)}
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
