import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/apiClient';

interface ImportSummary {
    totalProcessed: number;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
}

const Import: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [summary, setSummary] = useState<ImportSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
            setSummary(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post<ImportSummary>('/import/csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSummary(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to upload CSV. Please check the file format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Import Transactions</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <label className="block mb-4">
                    <span className="text-gray-700 font-medium mb-2 block">Upload CSV File</span>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                </label>

                <p className="text-sm text-gray-500 mb-4">
                    Expected format: <code>Date, Description, Amount (or Amount, ... )</code>
                </p>

                {error && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate('/transactions')}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                ${!file || uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </div>
            </div>

            {summary && (
                <div className="mt-6 bg-green-50 p-6 rounded-xl border border-green-100 animate-fade-in">
                    <h3 className="text-lg font-bold text-green-800 mb-2">Import Complete!</h3>
                    <ul className="space-y-1 text-green-700">
                        <li>✅ Processed: {summary.totalProcessed} lines</li>
                        <li>📥 Imported: {summary.importedCount} transactions</li>
                        <li>⏭️ Skipped: {summary.skippedCount} (Headers/Empty)</li>
                        {summary.errorCount > 0 && <li className="text-red-600">⚠️ Errors: {summary.errorCount} lines failed</li>}
                    </ul>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="mt-4 w-full py-2 bg-white text-green-600 font-medium border border-green-200 rounded-lg hover:bg-green-100"
                    >
                        View Transactions
                    </button>
                </div>
            )}
        </div>
    );
};

export default Import;
