import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CivicSense AI',
  description: 'Autonomous civic issue triage and resolution tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
