import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { SafeModeToggle } from '../components/dashboard/SafeModeToggle';
// import { transactionService } from '../services/api/transactionService';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [safeMode, setSafeMode] = useState(false);
    const [balance, setBalance] = useState(0);
    const [safeToSpend, setSafeToSpend] = useState(0);

    // Mock loading data
    useEffect(() => {
        // In real app, fetch forecast/balance from API based on safeMode
        // const data = await forecastService.getForecast(30, safeMode);
        setBalance(5240.50);
        setSafeToSpend(safeMode ? 1200.00 : 1800.00);
    }, [safeMode]);



    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-xs text-gray-500">Welcome, {user?.email?.split('@')[0]}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4">
                <SafeModeToggle enabled={safeMode} onChange={setSafeMode} />

                <BalanceCard
                    balance={balance}
                    safeToSpend={safeToSpend}
                />

                {/* Recent Transactions Stub */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                        <Link to="/transactions" className="text-xs text-primary font-medium">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${i % 2 === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {i % 2 === 0 ? '💸' : '💰'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{i % 2 === 0 ? 'Netflix' : 'Contract Payment'}</p>
                                        <p className="text-xs text-gray-500">Today</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${i % 2 === 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                    {i % 2 === 0 ? '-€15.99' : '+€2,500.00'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
