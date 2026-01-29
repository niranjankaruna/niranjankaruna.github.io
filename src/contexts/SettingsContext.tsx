import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserSettings } from '../services/settingsApi';
import { defaultSettings, fetchSettings, updateSettings as updateSettingsApi } from '../services/settingsApi';
import { useAuthStore } from '../store/authStore';

interface SettingsContextType {
    settings: UserSettings;
    loading: boolean;
    updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const loadSettings = async () => {
        if (!user) {
            setSettings(defaultSettings);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userSettings = await fetchSettings();
            // Fallback to defaultSettings if API returns partial or null
            setSettings({ ...defaultSettings, ...userSettings });
        } catch (error) {
            console.error('Failed to load settings:', error);
            setSettings(defaultSettings);
        } finally {
            setLoading(false);
        }
    };

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [settings.theme]);

    useEffect(() => {
        loadSettings();
    }, [user]);

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        try {
            const updated = await updateSettingsApi(newSettings);
            setSettings(updated);
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    const refreshSettings = async () => {
        await loadSettings();
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
