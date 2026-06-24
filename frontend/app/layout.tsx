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
  title: 'Collabsphere',
  description: 'Deploy autonomous AI agents on distributed infrastructure. Offload complex tasks to intelligent workers that run 24/7.',
  generator: 'v0.app',
  icons: {
    icon: '/newlogo.png',
    apple: '/newlogo.png',
  }
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