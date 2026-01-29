import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    PlusCircleIcon,
    ArrowPathIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface BottomTabBarProps {
    onAddClick?: () => void;
}

const tabs = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/forecast', icon: ChartBarIcon, label: 'Forecast' },
    { to: null, icon: PlusCircleIcon, label: 'Add', isAction: true },
    { to: '/recurring', icon: ArrowPathIcon, label: 'Rules' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ onAddClick }) => (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center pb-[env(safe-area-inset-bottom)] z-40 transition-colors duration-300">
        {tabs.map((tab) =>
            tab.isAction ? (
                <button
                    key={tab.label}
                    onClick={onAddClick}
                    className="flex flex-col items-center justify-center -mt-6"
                >
                    <div className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform">
                        <tab.icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] mt-1 text-gray-500 font-medium">{tab.label}</span>
                </button>
            ) : (
                <NavLink
                    key={tab.label}
                    to={tab.to!}
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center w-16 space-y-1",
                        isActive ? "text-primary" : "text-gray-400"
                    )}
                >
                    <tab.icon className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                </NavLink>
            )
        )}
    </nav>
);
