import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'FieldForce — Trabajo agrícola temporal',
  description: 'Marketplace que conecta productores con trabajadores rurales para tareas estacionales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-[family-name:var(--font-geist)]">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
