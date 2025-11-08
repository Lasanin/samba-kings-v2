
import { prisma } from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Invite({ params }: { params:{ token:string } }) {
  const inv = await prisma.invitation.findUnique({ where:{ token: params.token }, include:{ player:{ include:{ user:true } } } })
  if (!inv || inv.usedAt || inv.expiresAt < new Date()) {
    return <main className="card">Pozvánka je neplatná.</main>
  }
  return (
    <main className="card space-y-4">
      <h1 className="text-xl">Nastavení hesla pro {inv.player.name}</h1>
      <form action={`/invite/${params.token}/set`} method="post" className="space-y-3">
        <input type="hidden" name="token" value={params.token} />
        <input name="password" type="password" className="input" placeholder="Nové heslo" required />
        <button className="btn">Uložit</button>
      </form>
    </main>
  )
}
