import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { tagService } from '../../services/api/tagService';
import type { Tag } from '../../types/settings';

interface TagSelectorProps {
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagIds, onChange, className }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await tagService.getAll();
                setTags(data);
            } catch (error) {
                console.error('Failed to load tags', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, []);

    const addTag = (tagId: string) => {
        if (!selectedTagIds.includes(tagId)) {
            onChange([...selectedTagIds, tagId]);
        }
    };

    const removeTag = (tagId: string) => {
        onChange(selectedTagIds.filter(id => id !== tagId));
    };

    // Get selected and available tags
    const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
    const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id));

    if (loading) return <div className="h-20 w-full bg-gray-100 animate-pulse rounded-md" />;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>

            {/* Selected Tags Area (like a text box with chips) */}
            <div className="min-h-[42px] w-full p-2 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-2 mb-3">
                {selectedTags.length === 0 ? (
                    <span className="text-gray-400 text-sm py-0.5">Click tags below to add...</span>
                ) : (
                    selectedTags.map(tag => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                        >
                            {tag.name}
                            <button
                                type="button"
                                onClick={() => removeTag(tag.id)}
                                className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-500 hover:bg-indigo-200 hover:text-indigo-700 transition-colors"
                            >
                                <XMarkIcon className="h-3 w-3" />
                            </button>
                        </span>
                    ))
                )}
            </div>

            {/* Available Tags as Smart Chips */}
            {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(tag.id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                        >
                            + {tag.name}
                        </button>
                    ))}
                </div>
            )}

            {tags.length === 0 && (
                <p className="text-sm text-gray-500">No tags available. Create tags in Settings.</p>
            )}
        </div>
    );
};
