import {ClerkProvider} from '@clerk/nextjs';
import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#ec4899",
              colorBackground: "#0a0a0a",
              colorText: "#ffffff",
              colorTextSecondary: "#999999",
              colorInputBackground: "#1a1a1a",
              colorInputText: "#ffffff",
              colorNeutral: "#ffffff",
            },
            elements: {
              card: "bg-[#0a0a0a] border border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton:
                "bg-white/10 border border-white/20 text-white hover:bg-white/20",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-white/20",
              dividerText: "text-white/40",
              formFieldLabel: "text-white/70",
              formFieldInput:
                "bg-[#1a1a1a] border-white/20 text-white",
              footerActionLink: "text-pink-400 hover:text-pink-300",
            },
          }}
        >
          {children}
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  )
}