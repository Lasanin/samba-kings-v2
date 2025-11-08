'use client';
import { auth } from '../../lib/auth'
import { prisma } from '../../lib/prisma'

export default async function Me() {
  const session = await auth()
  if (!session?.user?.email) return <main className="card">Nejste přihlášen.</main>
  const user = await prisma.user.findUnique({ where:{ email: session.user.email }, include:{ player: true } })
  if (!user?.player) return <main className="card">Nemáte přiřazeného hráče.</main>
  const player = await prisma.player.findUnique({
    where:{ id: user.playerId! },
    include:{ payments:true, confirms:{ include:{ training:true } } }
  })
  if (!player) return <main className="card">Hráč nenalezen.</main>
  return (
    <main className="space-y-4">
      <section className="card">
        <h1 className="text-xl mb-2">Ahoj, {player.name}</h1>
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
      <section className="card">
        <h2 className="text-lg mb-2">Tréninky</h2>
        <ul className="space-y-1">
          {player.confirms.map(c=> (
            <li key={c.id}>
              {new Date(c.training.date).toLocaleString('cs-CZ')} — {c.attended ? 'účast' : 'neúčast'}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
