import React from 'react';
import {
    BiPencil,
    BiFolder,
    BiFile,
    BiShare,
    BiTrash,
    BiDownload,
} from 'react-icons/bi';
import { Item } from '@modules/explorer/interfaces';
import './Item.scss';

interface ExplorerItemProps {
    item: Item;
    onDrag: (e: React.DragEvent, name: string) => void;
    onDragOver: (e: React.DragEvent, item: Item) => void;
    onDrop: (e: React.DragEvent, item: Item) => void;
    onRename: (oldName: string) => void;
    onShare: (fileName: string) => void;
    onDelete: (fileName: string) => void;
    onVisit: (e: React.MouseEvent, item: Item) => void;
    onDownload: (fileName: string) => void;
}

export const ExplorerItem: React.FC<ExplorerItemProps> = ({
    item,
    onDrag,
    onDragOver,
    onDrop,
    onRename,
    onShare,
    onDelete,
    onVisit,
    onDownload,
}) => (
    <li
        className="inline-flex justify-between py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
        draggable={item.name !== '..'}
        onDrag={(e) => onDrag(e, item.name)}
        onDragOver={(e) => onDragOver(e, item)}
        onDrop={(e) => onDrop(e, item)}
        onDoubleClick={(e) => onVisit(e, item)}
    >
        <div className="itemName inline-flex items-center gap-x-3.5">
            <div>{item.isDirectory ? <BiFolder /> : <BiFile />}</div>
            <div
                className={
                    `itemName__text inline-flex gap-x-1.5 items-center` +
                    ((item.name === '..' && ' goBack') || '')
                }
            >
                {item.name}
                {item.name !== '..' && (
                    <div
                        onClick={() => onRename(item.name)}
                        className="itemName__editIcon p-1 rounded-full text-neutral-50 dark:text-neutral-900 bg-neutral-600 dark:bg-neutral-100"
                    >
                        <BiPencil />
                    </div>
                )}
            </div>
        </div>
        {item.name !== '..' && (
            <div className="itemControls inline-flex gap-x-2.5">
                {!item.isDirectory && (
                    <button onClick={() => onDownload(item.name)}>
                        <BiDownload />
                    </button>
                )}
                <button onClick={() => onShare(item.name)}>
                    <BiShare />
                </button>
                <button onClick={() => onDelete(item.name)}>
                    <BiTrash />
                </button>
            </div>
        )}
    </li>
);
