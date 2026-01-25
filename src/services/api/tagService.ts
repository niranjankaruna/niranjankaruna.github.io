import apiClient from './apiClient';
import type { Tag, CreateTagRequest } from '../../types/settings';

export const tagService = {
    getAll: async (): Promise<Tag[]> => {
        const response = await apiClient.get<Tag[]>('/tags');
        return response.data;
    },

    create: async (data: CreateTagRequest): Promise<Tag> => {
        const response = await apiClient.post<Tag>('/tags', data);
        return response.data;
    },

    update: async (id: string, data: CreateTagRequest): Promise<Tag> => {
        const response = await apiClient.put<Tag>(`/tags/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/tags/${id}`);
    }
};
