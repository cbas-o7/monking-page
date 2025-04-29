import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Monking - Diseños de Bordado",
  description: "Explora nuestra colección de diseños de bordado para camisas personalizadas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}