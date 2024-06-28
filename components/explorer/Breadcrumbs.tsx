import React from 'react';
import { BiHome } from "react-icons/bi";

interface BreadcrumbsProps {
    path: string[];
    onNavigate: (e: React.MouseEvent, index: number) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> =
    ({
         path,
         onNavigate
    }) => (
    <ol className="flex items-center whitespace-nowrap mt-2 mb-4 overflow-x-visible overflow-y-hidden">
        <li className="inline-flex items-center" onClick={(e) => !!path?.length && onNavigate(e, -1)}>
            <a className="flex items-center text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-200 dark:focus:text-blue-300"
               href="#">
                <BiHome />
            </a>
            <svg className="flex-shrink-0 size-5 text-gray-600 dark:text-neutral-200 mx-2" width="16"
                 height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
            </svg>
        </li>
        {
            !!path?.length && path.map((folder, index) => (
                <li className="inline-flex items-center text-sm font-semibold text-gray-500 truncate dark:text-neutral-500"
                    aria-current="page"
                    key={index}
                    onClick={(e) => (path.length - 1 !== index) && onNavigate(e, index)}
                >
                    <span
                        className="flex items-center text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-200 dark:focus:text-blue-300"
                    >
                        {folder}
                    </span>
                    {
                        path.length - 1 !== index && (
                            <svg className="flex-shrink-0 size-5 text-gray-600 dark:text-neutral-200 mx-2" width="16"
                                 height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                 aria-hidden="true">
                                <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
                            </svg>
                        )
                    }
                </li>
            ))
        }
    </ol>
    );