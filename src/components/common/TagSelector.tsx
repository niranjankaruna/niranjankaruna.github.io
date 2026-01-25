import { useState, useEffect, Fragment } from 'react';
import { TagIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Combobox, Transition } from '@headlessui/react';
import { tagService } from '../../services/api/tagService';
import type { Tag } from '../../types/settings';


interface TagSelectorProps {
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagIds, onChange, className }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [query, setQuery] = useState('');
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

    const filteredTags =
        query === ''
            ? tags
            : tags.filter((tag) => {
                return tag.name.toLowerCase().includes(query.toLowerCase());
            });

    const toggleTag = (tagId: string) => {
        if (selectedTagIds.includes(tagId)) {
            onChange(selectedTagIds.filter(id => id !== tagId));
        } else {
            onChange([...selectedTagIds, tagId]);
        }
    };

    if (loading) return <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <Combobox as="div" value={selectedTagIds} multiple onChange={onChange}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm border border-gray-300">
                        <div className="flex flex-wrap gap-1 p-2 min-h-[42px]">
                            {selectedTagIds.map(id => {
                                const tag = tags.find(t => t.id === id);
                                if (!tag) return null;
                                return (
                                    <span key={id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {tag.name}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleTag(id); }}
                                            className="ml-1 inline-flex flex-shrink-0 h-4 w-4 text-indigo-500 hover:text-indigo-600 focus:outline-none"
                                        >
                                            <span className="sr-only">Remove {tag.name}</span>
                                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                            </svg>
                                        </button>
                                    </span>
                                )
                            })}
                            <Combobox.Input
                                className="w-full border-none py-1 pl-1 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={selectedTagIds.length === 0 ? "Select tags..." : ""}
                            />
                        </div>
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                            {filteredTags.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredTags.map((tag) => (
                                    <Combobox.Option
                                        key={tag.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary/10 text-primary' : 'text-gray-900'
                                            }`
                                        }
                                        value={tag.id}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {tag.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-primary' : 'text-primary'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
};
