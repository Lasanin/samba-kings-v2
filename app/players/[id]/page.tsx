
import { prisma } from '../../../lib/prisma'

export default async function PlayerDetail({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
    include: { payments: true, user: true, confirms: { include:{ training:true } } }
  })
  if (!player) return <main className="card">Hráč nenalezen</main>
  return (
    <main className="space-y-4">
      <section className="card">
        <h1 className="text-xl mb-2">{player.name}</h1>
        <div>Email: {player.user?.email ?? '—'}</div>
        <div>Kredit: {player.credit} Kč</div>
      </section>
      <section className="card">
        <h2 className="text-lg mb-2">Platby</h2>
        <ul className="space-y-2">
          {player.payments.map(p=> (
            <li key={p.id} className="border border-slate-700 rounded-xl p-3">
              {p.amount} Kč {p.kind} — {p.status} {p.note ? `– ${p.note}`:''}
            </li>
          ))}
          {player.payments.length===0 && <div className="opacity-60">Žádné platby.</div>}
        </ul>
      </section>
    </main>
  )
}
