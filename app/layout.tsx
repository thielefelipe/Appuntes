import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Appuntes — Ayudantías y Preuniversitario Online",
  description: "Plataforma de tutorías especializadas en Matemática, Lenguaje, Ciencias e Inglés. PAES, 1° a 4° Medio y universitarios.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
