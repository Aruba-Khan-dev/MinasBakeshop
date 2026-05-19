import type { Metadata } from 'next'
import { Geist, Geist_Mono, Great_Vibes } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SidebarNav from '@/components/sidebar-nav'
import Header from '@/components/header'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' });

export const metadata: Metadata = {
  title: "Mina's Bakeshop - Crafting Sweetness Since 2024",
  description: "Mina's Bakeshop offers beautiful, delicious cakes for weddings, celebrations, and special moments. Custom designs, premium quality.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { CartProvider } from '@/context/cart-context'
import { SidebarProvider } from '@/context/sidebar-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${greatVibes.variable}`}>
        <CartProvider>
          <SidebarProvider>
            <Header />
            <SidebarNav />
            {children}
          </SidebarProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
