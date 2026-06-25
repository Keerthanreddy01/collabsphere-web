import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import BottomTabBar from '@/components/BottomTabBar'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/ThemeToggle'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'CollabSphere — Build Together, Ship Faster',
  description: 'CollabSphere is the social network for developers. Find teammates, share your builds, and grow your network with builders who ship.',
  generator: 'next',
  icons: {
    icon: '/newlogo.png',
    apple: '/newlogo.png',
  },
  openGraph: {
    title: 'CollabSphere — Build Together, Ship Faster',
    description: 'The social network for developers. Find teammates, share your builds, and ship together.',
    url: 'https://collabsphereweb.vercel.app',
    siteName: 'CollabSphere',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CollabSphere — Build Together, Ship Faster',
    description: 'The social network for developers. Find teammates, share your builds, and ship together.',
    site: '@collabsphere',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar,
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
          }
          .no-scrollbar,
          .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}} />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-black text-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ThemeToggle />
          {children}
          <BottomTabBar />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}