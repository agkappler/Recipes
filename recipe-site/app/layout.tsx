import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { Footer } from './_components/navigation/Footer';
import { Navbar } from './_components/navigation/Navbar';
import { ThemeRegistry } from './_components/ThemeRegistry';
import './globals.scss';
import { AppProvider } from './_components/AppContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Fargopolis',
    description: 'Development by Fargo',
    icons: {
        icon: '/icon.png'
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`flex flex-col min-h-screen ${inter.className}`}>
                <AppProvider>
                    <ThemeRegistry>
                        <Navbar />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </ThemeRegistry>
                </AppProvider>
                <ToastContainer />
            </body>
        </html>
    )
}
