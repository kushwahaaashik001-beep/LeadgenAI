import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // DHAYAN SE DEKHO: class="dark" add kar di hai niche
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-optima-purple-500/30`}>
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            {/* OPTIMA ko gradient-text class do jo tune globals.css mein banayi hai */}
            <h1 className="text-2xl font-black tracking-tighter gradient-text">OPTIMA</h1>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE PULSE
              </span>
            </div>
          </div>
        </nav>
        <main className="min-height-screen bg-grid-pattern">
             {children}
        </main>
      </body>
    </html>
  )
}
