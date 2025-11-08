
import { prisma } from '../../../lib/prisma'

export default async function TrainingDetail({ params }: { params: { id: string } }) {
  const t = await prisma.training.findUnique({
    where:{ id: params.id },
    include:{
      confirms:{ include:{ player:true }},
      payments:true
    }
  })
  const players = await prisma.player.findMany()
  if (!t) return <main className="card">Trénink nenalezen.</main>

  const statusByPlayer = new Map(t.payments.filter(p=>p.trainingId===t.id)
    .map(p=>[p.playerId, p.status]))

  return (
    <main className="space-y-4">
      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-xl flex-1">{new Date(t.date).toLocaleString('cs-CZ')}</div>
          <form action="/api/admin/trainings/update-price" method="post" className="flex gap-2">
            <input type="hidden" name="id" value={t.id} />
            <input name="price" type="number" className="input max-w-[120px]" defaultValue={t.price} />
            <button className="btn">Uložit cenu</button>
          </form>
        </div>

        <form action="/api/admin/trainings/save-attendance" method="post" className="space-y-2">
          <input type="hidden" name="trainingId" value={t.id} />
          <table className="w-full">
            <thead className="text-left opacity-70">
              <tr><th>Hráč</th><th>Účast</th><th>Platba</th></tr>
            </thead>
            <tbody>
              {t.confirms.map(c=> (
                <tr key={c.id} className="border-t border-slate-700">
                  <td>{c.player.name}</td>
                  <td>
                    <input type="checkbox" name="attended" value={c.playerId} defaultChecked={c.attended} />
                  </td>
                  <td>{statusByPlayer.get(c.playerId) ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn">Uložit účast</button>
        </form>

        <form action="/api/admin/trainings/confirm-bulk" method="post" className="flex gap-2">
          <input type="hidden" name="trainingId" value={t.id} />
          <button className="btn">Potvrdit platby</button>
        </form>
      </section>

      <section className="card space-y-2">
        <h2 className="text-lg">Přidat účastníky</h2>
        <form action="/api/admin/trainings/add-participants" method="post" className="flex gap-2">
          <input type="hidden" name="trainingId" value={t.id} />
          <select name="playerIds" multiple size={6} className="input h-40">
            {players.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn">Přidat vybrané</button>
        </form>
      </section>
    </main>
  )
}
