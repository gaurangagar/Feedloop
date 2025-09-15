'use client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
}:Readonly<{
    children:React.ReactNode;
}>) {
  return (
    <html>
        <SessionProvider>
            {children}
        </SessionProvider>
    </html>
    
  )
}