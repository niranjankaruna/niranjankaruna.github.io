import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { importService, type ImportSummary } from '../services/api/importService';

const Import: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [summary, setSummary] = useState<ImportSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (selectedFile: File) => {
        if (selectedFile && selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError(null);
            setSummary(null);
        } else {
            setError('Please upload a valid CSV file.');
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const data = await importService.uploadCsv(file);
            setSummary(data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to upload CSV. Please check the file format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto pb-24">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Import Transactions</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!file ? (
                        <>
                            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-900 font-medium mb-1">Click or drag file to upload</p>
                            <p className="text-sm text-gray-500">CSV files only</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <DocumentTextIcon className="w-12 h-12 text-primary mb-3" />
                            <p className="text-gray-900 font-medium mb-1">{file.name}</p>
                            <p className="text-sm text-gray-500 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                                className="text-red-500 text-sm hover:underline flex items-center"
                            >
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                Remove file
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500 mt-4 mb-4">
                    Expected format: <code>Date, Description, Amount (or Amount, ... )</code>
                </p>

                {error && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
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
                ${!file || uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'}`}
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
