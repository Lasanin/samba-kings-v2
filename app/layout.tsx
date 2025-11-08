
import './globals.css'
import Link from 'next/link'
import { auth } from '../lib/auth'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="cs"><body className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="space-x-3">
          <Link className="btn" href="/">Samba Kings</Link>
          {session?.user && <>
            <Link className="btn" href="/admin">Admin</Link>
            <span className="text-sm opacity-70">{session.user.email}</span>
          </>}
        </div>
        {!session?.user && <Link className="btn" href="/login">Přihlásit</Link>}
      </header>
      {children}
    </body></html>
  )
}
