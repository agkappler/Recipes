import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Footer } from './_components/navigation/Footer'
import { Navbar } from './_components/navigation/Navbar'
import { ThemeRegistry } from './_components/ThemeRegistry'
import './globals.scss'

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
                <ThemeRegistry>
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </ThemeRegistry>
            </body>
        </html>
    )
}
