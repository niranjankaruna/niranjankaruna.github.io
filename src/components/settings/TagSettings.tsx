import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon, TagIcon, PencilIcon } from '@heroicons/react/24/outline';
import { tagService } from '../../services/api/tagService';
import type { Tag, CreateTagRequest } from '../../types/settings';

export const TagSettings = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [newTag, setNewTag] = useState<CreateTagRequest>({
        name: '',
        color: '#6B7280',
        icon: 'tag'
    });

    const fetchTags = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tagService.getAll();
            setTags(data);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
            setError('Failed to load tags');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tagService.create(newTag);
            setIsAdding(false);
            setNewTag({ name: '', color: '#6B7280', icon: 'tag' });
            fetchTags();
        } catch (err) {
            console.error('Failed to add tag:', err);
            setError('Failed to add tag');
        }
    };

    const handleUpdateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTag) return;
        try {
            await tagService.update(editingTag.id, {
                name: editingTag.name,
                color: editingTag.color,
                icon: editingTag.icon
            });
            setEditingTag(null);
            fetchTags();
        } catch (err) {
            console.error('Failed to update tag:', err);
            setError('Failed to update tag');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this tag?')) return;
        try {
            await tagService.delete(id);
            fetchTags();
        } catch (err) {
            console.error('Failed to delete tag:', err);
            setError('Failed to delete tag');
        }
    };

    if (loading && tags.length === 0) return <div className="text-center py-4">Loading tags...</div>;

    const PRESET_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <TagIcon className="w-6 h-6" /> Expense Tags
                </h2>
                {!editingTag && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-full"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAddTag} className="mb-6 bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900 border-b pb-2">Add New Tag</h3>
                    <input
                        type="text"
                        placeholder="Tag Name"
                        required
                        value={newTag.name}
                        onChange={e => setNewTag({ ...newTag, name: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewTag({ ...newTag, color })}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${newTag.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1 text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-primary text-white rounded"
                        >
                            Add Tag
                        </button>
                    </div>
                </form>
            )}

            {editingTag && (
                <form onSubmit={handleUpdateTag} className="mb-6 bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100">
                    <h3 className="font-medium text-blue-900 border-b border-blue-200 pb-2">Edit Tag</h3>
                    <input
                        type="text"
                        placeholder="Tag Name"
                        required
                        value={editingTag.name}
                        onChange={e => setEditingTag({ ...editingTag, name: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <div>
                        <label className="block text-xs font-medium text-blue-800 mb-2">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setEditingTag({ ...editingTag, color })}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${editingTag.color === color ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditingTag(null)}
                            className="px-3 py-1 text-gray-600 hover:bg-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-primary text-white rounded shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}

            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <div
                        key={tag.id}
                        className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-gray-50 border border-gray-200"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color || '#6B7280' }}
                        />
                        <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                        <div className="flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingTag(tag)}
                                className="p-1 text-gray-400 hover:text-blue-500"
                            >
                                <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(tag.id)}
                                className="p-1 text-gray-400 hover:text-red-500"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
                {tags.length === 0 && !loading && (
                    <p className="text-sm text-gray-400 italic">No tags created yet.</p>
                )}
            </div>
        </div>
    );
};
