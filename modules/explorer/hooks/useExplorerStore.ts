import { create } from 'zustand';
import { Item } from '@modules/explorer/interfaces';
import { fileService } from '../services/explorer.service';

interface ExplorerState {
    items: Item[];
    currentPath: string[];
    isLoading: boolean;
    isSearching: boolean;
    searchResults: Item[];
    setItems: (items: Item[]) => void;
    setCurrentPath: (path: string[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsSearching: (isSearching: boolean) => void;
    setSearchResults: (results: Item[]) => void;
    fetchItems: () => Promise<void>;
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
    items: [],
    currentPath: [],
    isLoading: false,
    isSearching: false,
    searchResults: [],
    setItems: (items) => set({ items }),
    setCurrentPath: (path) => set({ currentPath: path }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsSearching: (isSearching) => set({ isSearching }),
    setSearchResults: (results) => set({ searchResults: results }),
    fetchItems: async () => {
        const { currentPath, setIsLoading, setItems } = get();
        setIsLoading(true);
        try {
            const items: Item[] = await fileService.listFiles(currentPath);
            setItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setIsLoading(false);
        }
    },
}));
