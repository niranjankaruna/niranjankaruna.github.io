import apiClient from './apiClient';
import type { Currency, CreateCurrencyRequest } from '../../types/settings';

export const currencyService = {
    getAll: async (): Promise<Currency[]> => {
        const response = await apiClient.get<Currency[]>('/currencies');
        return response.data;
    },

    create: async (data: CreateCurrencyRequest): Promise<Currency> => {
        const response = await apiClient.post<Currency>('/currencies', data);
        return response.data;
    },

    update: async (id: string, data: CreateCurrencyRequest): Promise<Currency> => {
        const response = await apiClient.put<Currency>(`/currencies/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/currencies/${id}`);
    },

    setBaseCurrency: async (id: string): Promise<Currency> => {
        const response = await apiClient.post<Currency>(`/currencies/${id}/base`);
        return response.data;
    }
};
