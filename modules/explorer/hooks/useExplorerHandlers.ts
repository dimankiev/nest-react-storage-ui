'use client';

import { fileService } from '../services/explorer.service';
import { useExplorerStore } from './useExplorerStore';

export const useExplorerHandlers = () => {
    const explorerStore = useExplorerStore;

    const fetchItems = async (folders: string[]) => {
        return await fileService.listFiles(folders);
    };

    const handleShare = async (fileName: string) => {
        const path = explorerStore.getState().currentPath;
        try {
            return await fileService.shareFile(fileName, path);
        } catch (error) {
            alert('Error sharing file');
        }
    };

    const handleRename = async (oldName: string, newName: string) => {
        const path = explorerStore.getState().currentPath;
        try {
            await fileService.renameFile(oldName, newName, path);
        } catch (error) {
            alert('Error renaming file');
        }
    };

    const handleMove = async (fileName: string, targetDir: string) => {
        const path = explorerStore.getState().currentPath;
        try {
            let moveTo = targetDir;
            if (targetDir === '..') moveTo = path.at(-1)!;
            await fileService.moveFile(fileName, moveTo, path);
        } catch (error) {
            alert('Error moving file');
        }
    };

    const handleDelete = async (fileName: string) => {
        const path = explorerStore.getState().currentPath;
        try {
            await fileService.deleteFile(fileName, path);
        } catch (error) {
            alert('Error deleting file');
        }
    };

    return { handleShare, handleRename, handleMove, handleDelete, fetchItems };
};
