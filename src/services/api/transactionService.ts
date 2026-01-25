import apiClient from './apiClient';
import type { Transaction, CreateTransactionRequest, ForecastData } from '../../types/transaction';

export const transactionService = {
    // Get all transactions
    getAll: async (): Promise<Transaction[]> => {
        const response = await apiClient.get<Transaction[]>('/transactions');
        return response.data;
    },

    // Get transactions by date range
    getByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
        const response = await apiClient.get<Transaction[]>('/transactions', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Get single transaction
    getById: async (id: string): Promise<Transaction> => {
        const response = await apiClient.get<Transaction>(`/transactions/${id}`);
        return response.data;
    },

    // Create transaction
    create: async (data: CreateTransactionRequest): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>('/transactions', data);
        return response.data;
    },

    // Update transaction
    update: async (id: string, data: CreateTransactionRequest): Promise<Transaction> => {
        const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
        return response.data;
    },

    // Delete transaction
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/transactions/${id}`);
    },

    // Quick actions
    markReceived: async (id: string, receivedDate?: string): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(`/transactions/${id}/received`, null, {
            params: receivedDate ? { receivedDate } : undefined
        });
        return response.data;
    },

    markPaid: async (id: string, paidDate?: string): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(`/transactions/${id}/paid`, null, {
            params: paidDate ? { paidDate } : undefined
        });
        return response.data;
    },

    markSkipped: async (id: string): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(`/transactions/${id}/skip`);
        return response.data;
    },

    changeConfidence: async (id: string, confidence: string): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(`/transactions/${id}/confidence`, null, {
            params: { confidence }
        });
        return response.data;
    }
};

export const forecastService = {
    getForecast: async (days: number = 30, safeMode: boolean = false, startingBalance: number = 0): Promise<ForecastData> => {
        const response = await apiClient.get<ForecastData>('/forecast', {
            params: { days, safeMode, startingBalance }
        });
        return response.data;
    }
};
