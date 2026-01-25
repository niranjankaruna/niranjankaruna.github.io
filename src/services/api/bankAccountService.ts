import apiClient from './apiClient';
import type { BankAccount, CreateBankAccountRequest } from '../../types/settings';

export const bankAccountService = {
    getAll: async (): Promise<BankAccount[]> => {
        const response = await apiClient.get<BankAccount[]>('/bank-accounts');
        return response.data;
    },

    create: async (data: CreateBankAccountRequest): Promise<BankAccount> => {
        const response = await apiClient.post<BankAccount>('/bank-accounts', data);
        return response.data;
    },

    update: async (id: string, data: CreateBankAccountRequest): Promise<BankAccount> => {
        const response = await apiClient.put<BankAccount>(`/bank-accounts/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/bank-accounts/${id}`);
    }
};
