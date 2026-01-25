import { supabase } from './supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface UserSettings {
    forecastPeriod: number;
    defaultSafeMode: boolean;
    lowBalanceWarning: number;
    theme: string;
    dateFormat: string;
}

export const defaultSettings: UserSettings = {
    forecastPeriod: 30,
    defaultSafeMode: false,
    lowBalanceWarning: 500,
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
};

async function getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('No active session');
    }
    return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
    };
}

export async function fetchSettings(): Promise<UserSettings> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/v1/settings`, { headers });

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return defaultSettings;
    }
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/v1/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        throw new Error('Failed to update settings');
    }

    return await response.json();
}
