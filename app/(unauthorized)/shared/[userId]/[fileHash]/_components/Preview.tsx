'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@modules/api';
import { FiFile, FiFolder, FiDownload } from 'react-icons/fi';
import { Item } from '@modules/explorer/interfaces';

const SharedFilePreview: React.FC = () => {
    const { userId, fileHash } = useParams<{ userId: string; fileHash: string }>();
    const [fileInfo, setFileInfo] = useState<{
        originalName: string;
        sharedAt: string;
        isDirectory: boolean;
        contents?: Item[];
    } | null>(null);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFileInfo();
    }, [userId, fileHash, currentPath]);

    const fetchFileInfo = async () => {
        if (!userId || !fileHash) {
            setError('Invalid URL parameters');
            return;
        }
        try {
            const queryPath = currentPath.join('/');
            const response = await api.get(`/shared/${userId}/${fileHash}`, {
                params: { path: queryPath }
            });
            setFileInfo(response.data);
        } catch (err) {
            setError('Failed to fetch file information');
        }
    };

    const handleDownload = (fileName: string) => {
        if (userId && fileHash) {
            const queryPath = [...currentPath, fileName].join('/');
            window.location.href = `/api/shared/${userId}/${fileHash}/download?path=${queryPath}`;
        }
    };

    if (error) {
        window.location.replace('/error/404')
        // return <div className="text-red-500">{error}</div>;
    }

    if (!fileInfo) {
        return <div className="text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-gray-700 dark:shadow-neutral-700/[.7]">
            <div className="p-4 md:p-5">
                <div className="flex flex-col items-center">
                    {fileInfo.isDirectory && (
                        <FiFolder className="mb-6 h-16 w-16 mx-auto text-neutral-900 dark:text-neutral-100"/>
                    ) || (
                        <FiFile className="mb-6 h-16 w-16 mx-auto text-neutral-900 dark:text-neutral-100"/>
                    )}
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                        {fileInfo.originalName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Shared on: {new Date(fileInfo.sharedAt).toLocaleString()}
                    </p>
                    {
                        !fileInfo.isDirectory && (
                            <button
                                type="button"
                                className="py-3 px-4 inline-flex items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-neutral-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                onClick={() => handleDownload(fileInfo.originalName)}
                            >
                                <FiDownload className="w-4 h-4"/>
                                Download File
                            </button>
                        )
                    }
                </div>

                {fileInfo.isDirectory && (
                    <ul className="space-y-2">
                        {fileInfo.contents?.filter(i => !i?.isDirectory)?.map((item, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded">
                                <div className="flex items-center text-neutral-900 dark:text-neutral-50">
                                    {item.isDirectory ? <FiFolder className="mr-2"/> : <FiFile className="mr-2"/>}
                                    <span>
                                          {item.name}
                                        </span>
                                </div>
                                {!item.isDirectory && (
                                    <button onClick={() => handleDownload(item.name)}
                                            className="text-neutral-900 dark:text-neutral-50">
                                        <FiDownload/>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SharedFilePreview;