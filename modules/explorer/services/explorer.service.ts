'use client';

import { api } from '@modules/api';

export const fileService = {
    listFiles: async (path: string[]) => {
        try {
            const response = await api.post('/files/list', { path });
            return response.data;
        } catch (error) {
            console.error('Error fetching files:', error);
            throw error;
        }
    },

    shareFile: async (fileName: string, path: string[]) => {
        try {
            const response = await api.post(`/files/share`, { fileName, path });
            return response.data;
        } catch (error) {
            console.error('Error sharing file:', error);
            throw error;
        }
    },

    renameFile: async (oldName: string, newName: string, path: string[]) => {
        try {
            const response = await api.post('/files/rename', {
                oldName,
                newName,
                path,
            });
            return response.data;
        } catch (error) {
            console.error('Error renaming file:', error);
            throw error;
        }
    },

    moveFile: async (fileName: string, targetDir: string, path: string[]) => {
        try {
            const response = await api.post('/files/move', {
                fileName,
                targetDir,
                path,
            });
            return response.data;
        } catch (error) {
            console.error('Error moving file:', error);
            throw error;
        }
    },

    deleteFile: async (fileName: string, path: string[]) => {
        try {
            const response = await api.post(`/files/delete`, {
                fileName,
                path,
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    },
};
