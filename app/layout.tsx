import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 p-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter text-green-500">OPTIMA</h1>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE PULSE
              </span>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
