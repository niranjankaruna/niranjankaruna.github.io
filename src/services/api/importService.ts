import api from './apiClient';

export interface ImportSummary {
    totalProcessed: number;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
}

export const importService = {
    uploadCsv: async (file: File): Promise<ImportSummary> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ImportSummary>('/import/csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
