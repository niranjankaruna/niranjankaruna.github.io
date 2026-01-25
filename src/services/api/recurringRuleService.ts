import apiClient from './apiClient';
import type { RecurringRule, CreateRecurringRuleRequest } from '../../types/recurringRule';

const ENDPOINT = '/recurring-rules';

export const recurringRuleService = {
    getAll: async (): Promise<RecurringRule[]> => {
        const response = await apiClient.get<RecurringRule[]>(ENDPOINT);
        return response.data;
    },

    getById: async (id: string): Promise<RecurringRule> => {
        const response = await apiClient.get<RecurringRule>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (data: CreateRecurringRuleRequest): Promise<RecurringRule> => {
        const response = await apiClient.post<RecurringRule>(ENDPOINT, data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateRecurringRuleRequest>): Promise<RecurringRule> => {
        const response = await apiClient.put<RecurringRule>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    processDue: async (): Promise<void> => {
        await apiClient.post(`${ENDPOINT}/process`);
    }
};
