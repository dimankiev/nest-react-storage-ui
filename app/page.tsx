'use client';

export default function Home() {
    return (
        <>
            <a
                className="group block bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-all duration-300 dark:bg-white/10 dark:hover:bg-white/10"
                href="/login"
            >
                <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
                    <p className="me-2 inline-block text-sm text-gray-800 dark:text-neutral-200">
                        Simple file manager for anyone.
                    </p>
                    <span className="group-hover:underline decoration-2 inline-flex justify-center items-center gap-x-2 font-semibold text-blue-600 text-sm dark:text-blue-500">
                        Sign in now!
                        <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </span>
                </div>
            </a>
            <div className="bg-gradient-to-b from-violet-600/10 via-transparent">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
                    <div className="flex justify-center">
                        <a
                            className="group inline-block bg-white/10 hover:bg-white/10 border border-white/10 p-1 ps-4 rounded-full shadow-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                            href="/login"
                        >
                            <p className="me-2 inline-block text-white text-sm">
                                Beta version is live.
                            </p>
                            <span className="group-hover:bg-white/10 py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/10 font-semibold text-white text-sm">
                                <svg
                                    className="flex-shrink-0 size-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </span>
                        </a>
                    </div>

                    <div className="max-w-3xl text-center mx-auto">
                        <h1 className="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            File Explorer
                        </h1>
                    </div>

                    <div className="max-w-3xl text-center mx-auto">
                        <p className="text-lg text-gray-400">
                            Upload, move, download, rename, share and delete
                            files
                        </p>
                    </div>

                    <div className="text-center">
                        <a
                            className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-6 dark:focus:ring-offset-gray-800"
                            href="/login"
                        >
                            Get started
                            <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
