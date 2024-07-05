'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BiFolder, BiUpload, BiSearch, BiLoaderCircle } from 'react-icons/bi';
import { useExplorerHandlers, useExplorerStore } from '@modules/explorer/hooks';
import { Breadcrumbs, ExplorerItem } from '@components/explorer';
import { DynamicPopup } from '@components/popup';
import { Item } from '@modules/explorer/interfaces';
import { api } from '@modules/api';
import { PopupState } from '@modules/popup/interfaces';
import { itemMovePopup } from './popups';

export const Explorer: React.FC = () => {
    const { items, currentPath, fetchItems, setCurrentPath } =
        useExplorerStore();
    const { handleShare, handleRename, handleMove, handleDelete } =
        useExplorerHandlers();
    const [draggedItemName, setDraggedItemName] = useState<string | null>(null);
    const [popupState, setPopupState] = useState<PopupState>({
        isOpen: false,
        title: '',
        content: '',
        buttons: [],
    });
    const [sharedFileUrl, setSharedFileUrl] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isSearching) {
            loadItems();
        }
    }, [currentPath, isSearching]);

    const loadItems = async () => {
        setIsLoading(true);
        await fetchItems();
        setIsLoading(false);
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        setIsLoading(true);
        try {
            const { data } = await api.post('/files/search', {
                searchTerm,
                path: currentPath,
            });
            const searchItems: Item[] = data.map((result: string) => ({
                name: result.split('/').pop(),
                isDirectory: result.endsWith('/'),
                path: result.split('/').slice(0, -1).join('/'),
            }));
            setSearchResults(searchItems);
        } catch (error) {
            console.error('Search failed:', error);
            setPopupState({
                isOpen: true,
                title: 'Error',
                content: 'Failed to perform search',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-red-500',
                    },
                ],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
        setSearchResults([]);
    };

    const displayedItems = isSearching ? searchResults : items;

    function handleOnDrag(_: React.DragEvent, name: string): void {
        setDraggedItemName(name);
    }

    function handleOnDragOver(e: React.DragEvent, item: Item): void {
        e.preventDefault();
        if (!item.isDirectory) return;
        // TODO: Highlight the target directory
    }

    async function handleOnDrop(
        e: React.DragEvent,
        target: Item
    ): Promise<void> {
        e.preventDefault();
        if (!target.isDirectory || !draggedItemName) return;
        try {
            await handleMove(draggedItemName, target.name);
            await fetchItems();
            itemMovePopup(
                setPopupState,
                popupState,
                draggedItemName,
                target.name,
                true
            );
        } catch (error) {
            itemMovePopup(
                setPopupState,
                popupState,
                draggedItemName,
                target.name,
                false
            );
        }
    }

    function handleVisit(e: React.MouseEvent, item: Item): void {
        e.preventDefault();
        if (!item.isDirectory) return;
        let newPath;
        if (item.name === '..') newPath = currentPath.slice(0, -1);
        else newPath = [...currentPath, item.name];
        setCurrentPath(newPath);
    }

    function handleNavigate(e: React.MouseEvent, index: number): void {
        e.preventDefault();
        if (index === -1) return setCurrentPath([]);
        const path = currentPath.slice(0, index + 1);
        setCurrentPath(path);
    }

    const getFullSharedUrl = (partialUrl: string): string => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        return `${baseUrl}${partialUrl}`;
    };

    const handleShareAction = async (fileName: string) => {
        try {
            const {
                data: { isShared },
            } = await api.post('/files/isShared', {
                fileName,
                path: currentPath,
            });

            if (isShared) {
                const { url } = await handleShare(fileName);
                setSharedFileUrl(url);
                setPopupState({
                    isOpen: true,
                    title: 'File Already Shared',
                    content: `The file ${fileName} is already shared.`,
                    buttons: [
                        {
                            text: 'Copy URL',
                            onClick: () => {
                                navigator.clipboard.writeText(
                                    getFullSharedUrl(url)
                                );
                                setPopupState({ ...popupState, isOpen: false });
                            },
                            color: 'bg-blue-500',
                        },
                        {
                            text: 'Unshare',
                            onClick: () => handleUnshare(fileName),
                            color: 'bg-red-500',
                        },
                        {
                            text: 'Close',
                            onClick: () =>
                                setPopupState({ ...popupState, isOpen: false }),
                            color: 'bg-gray-500',
                        },
                    ],
                });
            } else {
                setPopupState({
                    isOpen: true,
                    title: 'Share Item',
                    content: (
                        <span>
                            Do you want to share the <b>{fileName}</b>?
                            <br />
                            If you move, rename, or delete it, the shared link
                            will be revoked.
                        </span>
                    ),
                    buttons: [
                        {
                            text: 'Yes',
                            onClick: async () => {
                                try {
                                    const { url } = await handleShare(fileName);
                                    setSharedFileUrl(url);
                                    setPopupState({
                                        isOpen: true,
                                        title: 'Shared successfully',
                                        content: `${fileName} has been shared.`,
                                        buttons: [
                                            {
                                                text: 'Copy URL',
                                                onClick: () => {
                                                    navigator.clipboard.writeText(
                                                        getFullSharedUrl(url)
                                                    );
                                                    setPopupState({
                                                        ...popupState,
                                                        isOpen: false,
                                                    });
                                                },
                                                color: 'bg-blue-500',
                                            },
                                            {
                                                text: 'Close',
                                                onClick: () =>
                                                    setPopupState({
                                                        ...popupState,
                                                        isOpen: false,
                                                    }),
                                                color: 'bg-gray-500',
                                            },
                                        ],
                                    });
                                } catch (error) {
                                    console.error(error);
                                    setPopupState({
                                        isOpen: true,
                                        title: 'Error',
                                        content: 'Failed to share!',
                                        buttons: [
                                            {
                                                text: 'OK',
                                                onClick: () =>
                                                    setPopupState({
                                                        ...popupState,
                                                        isOpen: false,
                                                    }),
                                                color: 'bg-red-500',
                                            },
                                        ],
                                    });
                                }
                            },
                            color: 'bg-blue-500',
                        },
                        {
                            text: 'No',
                            onClick: () =>
                                setPopupState({ ...popupState, isOpen: false }),
                            color: 'bg-gray-500',
                        },
                    ],
                });
            }
        } catch (error) {
            console.error(error);
            setPopupState({
                isOpen: true,
                title: 'Error',
                content: 'Failed to check file sharing status',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-red-500',
                    },
                ],
            });
        }
    };

    const handleUnshare = async (fileName: string) => {
        try {
            await api.post('/files/unshare', { fileName, path: currentPath });
            setPopupState({
                isOpen: true,
                title: 'Success',
                content: `${fileName} has been unshared.`,
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-blue-500',
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            setPopupState({
                isOpen: true,
                title: 'Error',
                content: 'Failed to unshare file',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-red-500',
                    },
                ],
            });
        }
    };

    async function handleRenameAction(oldName: string): Promise<void> {
        setPopupState({
            isOpen: true,
            title: 'Rename',
            content: (
                <div>
                    <p>Enter new name for {oldName}:</p>
                    <input
                        id="newFileName"
                        type="text"
                        className="mt-2 p-2 w-full border rounded bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-200"
                        placeholder="Enter new name"
                        defaultValue={oldName}
                    />
                </div>
            ),
            buttons: [
                {
                    text: 'Rename',
                    onClick: async () => {
                        const newName = (
                            document.getElementById(
                                'newFileName'
                            ) as HTMLInputElement
                        ).value;
                        try {
                            await handleRename(oldName, newName);
                            await fetchItems();
                            setPopupState({
                                isOpen: true,
                                title: 'Success',
                                content: `Renamed ${oldName} to ${newName}`,
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-blue-500',
                                    },
                                ],
                            });
                        } catch (error) {
                            setPopupState({
                                isOpen: true,
                                title: 'Error',
                                content: 'Failed to rename!',
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-red-500',
                                    },
                                ],
                            });
                        }
                    },
                    color: 'bg-blue-500',
                },
                {
                    text: 'Cancel',
                    onClick: () =>
                        setPopupState({ ...popupState, isOpen: false }),
                    color: 'bg-gray-500',
                },
            ],
        });
    }

    async function handleDeleteAction(fileName: string): Promise<void> {
        setPopupState({
            isOpen: true,
            title: 'Confirm Delete',
            content: `Are you sure you want to delete ${fileName}?`,
            buttons: [
                {
                    text: 'Delete',
                    onClick: async () => {
                        try {
                            await handleDelete(fileName);
                            await fetchItems();
                            setPopupState({
                                isOpen: true,
                                title: 'Success',
                                content: `Deleted ${fileName}`,
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-blue-500',
                                    },
                                ],
                            });
                        } catch (error) {
                            setPopupState({
                                isOpen: true,
                                title: 'Error',
                                content: 'Failed to delete file',
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-red-500',
                                    },
                                ],
                            });
                        }
                    },
                    color: 'bg-red-500',
                },
                {
                    text: 'Cancel',
                    onClick: () =>
                        setPopupState({ ...popupState, isOpen: false }),
                    color: 'bg-gray-500',
                },
            ],
        });
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleCreateFolder(): Promise<void> {
        setPopupState({
            isOpen: true,
            title: 'Create New Folder',
            content: (
                <input
                    id="newFolderName"
                    type="text"
                    className="mt-2 p-2 w-full border rounded bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-200"
                    placeholder="Enter folder name"
                />
            ),
            buttons: [
                {
                    text: 'Create',
                    onClick: async () => {
                        const folderName = (
                            document.getElementById(
                                'newFolderName'
                            ) as HTMLInputElement
                        ).value;
                        try {
                            await api.post('/files/create', {
                                folderName,
                                path: currentPath,
                            });
                            await fetchItems();
                            setPopupState({
                                isOpen: true,
                                title: 'Success',
                                content: `Folder ${folderName} created successfully`,
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-blue-500',
                                    },
                                ],
                            });
                        } catch (error) {
                            setPopupState({
                                isOpen: true,
                                title: 'Error',
                                content: 'Failed to create folder',
                                buttons: [
                                    {
                                        text: 'OK',
                                        onClick: () =>
                                            setPopupState({
                                                ...popupState,
                                                isOpen: false,
                                            }),
                                        color: 'bg-red-500',
                                    },
                                ],
                            });
                        }
                    },
                    color: 'bg-blue-500',
                },
                {
                    text: 'Cancel',
                    onClick: () =>
                        setPopupState({ ...popupState, isOpen: false }),
                    color: 'bg-gray-500',
                },
            ],
        });
    }

    async function handleUpload(files: FileList): Promise<void> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('path', JSON.stringify(currentPath));

        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchItems();
            setPopupState({
                isOpen: true,
                title: 'Success',
                content: 'Files uploaded successfully',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-blue-500',
                    },
                ],
            });
        } catch (error) {
            setPopupState({
                isOpen: true,
                title: 'Error',
                content: 'Failed to upload files',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-red-500',
                    },
                ],
            });
        }
    }

    async function handleDownload(fileName: string): Promise<void> {
        try {
            const response = await api.post(`/files/download`, {
                fileName,
                path: currentPath,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            setPopupState({
                isOpen: true,
                title: 'Error',
                content: 'Failed to download file',
                buttons: [
                    {
                        text: 'OK',
                        onClick: () =>
                            setPopupState({ ...popupState, isOpen: false }),
                        color: 'bg-red-500',
                    },
                ],
            });
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="w-full text-neutral-900 dark:text-neutral-50">
                File Explorer
            </h1>
            <Breadcrumbs path={currentPath} onNavigate={handleNavigate} />
            <div className="mb-4 flex justify-between items-center">
                <div className="flex-grow mr-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search files or folders..."
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <BiSearch className="mr-2" />
                    Search
                </button>
                {isSearching && (
                    <button
                        onClick={clearSearch}
                        className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className="mb-4 flex justify-end space-x-2">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <BiUpload className="mr-2" />
                    Upload
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                        e.target.files && handleUpload(e.target.files)
                    }
                    className="hidden"
                    multiple
                />
                <button
                    onClick={handleCreateFolder}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <BiFolder className="mr-2" />
                    New Folder
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <BiLoaderCircle className="animate-spin text-4xl text-blue-500" />
                </div>
            ) : (
                <ul className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-700">
                    {!isSearching && currentPath.length > 0 && (
                        <ExplorerItem
                            item={{ name: '..', isDirectory: true }}
                            onDrag={handleOnDrag}
                            onDragOver={handleOnDragOver}
                            onDrop={handleOnDrop}
                            onRename={handleRenameAction}
                            onShare={handleShareAction}
                            onDelete={handleDeleteAction}
                            onVisit={handleVisit}
                            onDownload={handleDownload}
                        />
                    )}
                    {displayedItems
                        .filter((i) => i.isDirectory)
                        .map((item) => (
                            <ExplorerItem
                                key={item.name}
                                item={item}
                                onDrag={handleOnDrag}
                                onDragOver={handleOnDragOver}
                                onDrop={handleOnDrop}
                                onRename={handleRenameAction}
                                onShare={handleShareAction}
                                onDelete={handleDeleteAction}
                                onVisit={handleVisit}
                                onDownload={handleDownload}
                            />
                        ))}
                    {displayedItems
                        .filter((i) => !i.isDirectory)
                        .map((item) => (
                            <ExplorerItem
                                key={item.name}
                                item={item}
                                onDrag={handleOnDrag}
                                onDragOver={handleOnDragOver}
                                onDrop={handleOnDrop}
                                onRename={handleRenameAction}
                                onShare={handleShareAction}
                                onDelete={handleDeleteAction}
                                onVisit={handleVisit}
                                onDownload={handleDownload}
                            />
                        ))}
                </ul>
            )}
            {isSearching && searchResults.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 mt-4">
                    No results found
                </p>
            )}
            <DynamicPopup
                isOpen={popupState.isOpen}
                onClose={() => setPopupState({ ...popupState, isOpen: false })}
                title={popupState.title}
                buttons={popupState.buttons}
            >
                {popupState.content}
            </DynamicPopup>
        </div>
    );
};
