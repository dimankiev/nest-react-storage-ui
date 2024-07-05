import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'File Explorer',
    description: 'Upload and share files with ease.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={
                    inter.className +
                    ' size-full bg-neutral-50 dark:bg-neutral-800'
                }
            >
                {children}
            </body>
        </html>
    );
}
