import apiClient from './apiClient';
import type { Transaction, CreateTransactionRequest } from '../../types/transaction';

export const transactionService = {
    getAll: async () => {
        const response = await apiClient.get<Transaction[]>('/transactions');
        return response.data;
    },

    create: async (data: CreateTransactionRequest) => {
        const response = await apiClient.post<Transaction>('/transactions', data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/transactions/${id}`);
    }
};
