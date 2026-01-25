import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';
import { TransactionForm } from '../transactions/TransactionForm';

export const AppLayout = () => {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleTransactionSuccess = () => {
        // Force refresh by navigating to same route
        navigate(location.pathname, { replace: true });
        // Or reload the window for simpler approach
        window.location.reload();
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main Content Area */}
            <div className="flex-1 pb-20">
                {/* pb-20 ensures content isn't hidden behind bottom tab bar */}
                <Outlet />
            </div>

            {/* Shared Components */}
            <BottomTabBar onAddClick={() => setIsTransactionModalOpen(true)} />

            <TransactionForm
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onSuccess={handleTransactionSuccess}
            />
        </div>
    );
};
