
import { prisma } from '../../lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Admin({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab==='players' ? 'players' : 'trainings'
  const players = await prisma.player.findMany({ include:{ user:true } })
  const trainings = await prisma.training.findMany({ orderBy:{date:'desc'} })
  return (
    <main className="space-y-4">
      <div className="flex gap-2">
        <Link className={`btn ${tab==='trainings'?'bg-slate-600':''}`} href="/admin?tab=trainings">Tréninky</Link>
        <Link className={`btn ${tab==='players'?'bg-slate-600':''}`} href="/admin?tab=players">Hráči</Link>
      </div>

      {tab==='trainings' && (
        <section className="card space-y-4">
          <form action="/api/admin/trainings/create" method="post" className="flex gap-2 items-center flex-wrap">
            <input name="date" type="datetime-local" className="input max-w-xs" required />
            <input name="price" type="number" className="input max-w-[120px]" placeholder="Kč" required />
            <button className="btn">Přidat</button>
          </form>
          <table className="w-full">
            <thead className="text-left opacity-70"><tr><th>Datum</th><th>Cena</th><th>Akce</th></tr></thead>
            <tbody>
              {trainings.map(t=> (
                <tr key={t.id} className="border-t border-slate-700">
                  <td>{new Date(t.date).toLocaleString('cs-CZ')}</td>
                  <td>{t.price} Kč</td>
                  <td className="space-x-2">
                    <Link className="btn" href={`/trainings/${t.id}`}>Detail</Link>
                    <form action="/api/admin/trainings/delete" method="post" className="inline">
                      <input type="hidden" name="id" value={t.id} />
                      <button className="btn">Smazat</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab==='players' && (
        <section className="card">
          <form action="/api/admin/players/create" method="post" className="flex gap-2 mb-4 flex-wrap">
            <input name="name" className="input" placeholder="Jméno" required />
            <input name="email" className="input" placeholder="Email (volitelně)" />
            <button className="btn">Přidat</button>
          </form>
          <table className="w-full">
            <thead className="text-left opacity-70"><tr><th>Jméno</th><th>Email</th><th>Kredit</th><th>Účet</th><th>Akce</th></tr></thead>
            <tbody>
              {players.map(p=> (
                <tr key={p.id} className="border-t border-slate-700">
                  <td><Link className="underline" href={`/players/${p.id}`}>{p.name}</Link></td>
                  <td>{p.user?.email ?? '—'}</td>
                  <td>{p.credit} Kč</td>
                  <td>{p.user?.passwordHash ? 'Heslo nastaveno' : 'Bez hesla'}</td>
                  <td className="space-x-2">
                    <form action="/api/admin/players/invite" method="post" className="inline">
                      <input type="hidden" name="playerId" value={p.id} />
                      <button className="btn">Pozvánka</button>
                    </form>
                    <form action="/api/admin/players/delete" method="post" className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn">Smazat</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}
