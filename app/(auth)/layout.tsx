import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'
import '../globals.css'
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: 'Tesserax',
  description: 'A Next.js 13 Threads Application'
}

const inter = Inter({ subsets: ['latin']})

export default function RootLayout({ 
  children 
} : { 
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
        baseTheme: dark,
      }}>
      <html lang="en"> 
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            { children }
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}