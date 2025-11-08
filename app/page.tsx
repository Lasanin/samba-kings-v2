'use client';
import Link from 'next/link'
import { auth } from '../lib/auth'
import { prisma } from '../lib/prisma'

export default async function Home() {
  const session = await auth()
  const notes = await prisma.announcement.findMany({ orderBy:{createdAt:'desc'}})
  return (
    <main className="space-y-6">
      <div className="flex gap-3">
        <Link className="btn" href="/admin">Admin</Link>
        <Link className="btn" href="/me">Můj profil</Link>
      </div>
      <section className="card">
        <h2 className="text-xl mb-3">Nástěnka</h2>
        {session?.user && (session.user as any).role==='ADMIN' && (
          <form action="/api/announcements/create" method="post" className="flex gap-2 mb-4">
            <input name="body" className="input" placeholder="Nová aktualita..." />
            <button className="btn" type="submit">Přidat</button>
          </form>
        )}
        <div className="space-y-3">
          {notes.map(n=> (
            <div key={n.id} className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <div className="text-sm opacity-70">{new Date(n.createdAt).toLocaleString('cs-CZ')}</div>
              <div>{n.body}</div>
            </div>
          ))}
          {notes.length===0 && <div className="opacity-60">Žádné aktuality.</div>}
        </div>
      </section>
    </main>
  )
}
