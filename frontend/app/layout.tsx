import React from "react";
import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BottomTabBar from "@/components/BottomTabBar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CollabSphere - Build together, ship faster",
  description:
    "CollabSphere is the developer network for builders. Find teammates, share your builds, and grow with people who ship.",
  generator: "next",
  icons: {
    icon: "/newlogo.png",
    apple: "/newlogo.png",
  },
  openGraph: {
    title: "CollabSphere - Build together, ship faster",
    description:
      "The developer network for builders. Find teammates, share your builds, and ship together.",
    url: "https://collabsphereweb.vercel.app",
    siteName: "CollabSphere",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabSphere - Build together, ship faster",
    description:
      "The developer network for builders. Find teammates, share your builds, and ship together.",
    site: "@collabsphere",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar,
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
          }
          .no-scrollbar,
          .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          {children}
          <BottomTabBar />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
