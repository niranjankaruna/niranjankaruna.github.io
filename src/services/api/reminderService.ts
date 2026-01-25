import apiClient from './apiClient';
import type { ReminderResponse } from '../../types/reminder';

export const reminderService = {
    getUpcoming: async (days: number = 7): Promise<ReminderResponse[]> => {
        const response = await apiClient.get(`/reminders?days=${days}`);
        return response.data;
    }
};
