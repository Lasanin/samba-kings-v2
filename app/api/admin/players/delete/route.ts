
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const id = String(form.get('id') ?? '')
  if (!id) return NextResponse.json({ error:'Chybí ID.' }, { status: 400 })
  await prisma.payment.deleteMany({ where:{ playerId: id } })
  await prisma.trainingConfirmation.deleteMany({ where:{ playerId: id } })
  await prisma.invitation.deleteMany({ where:{ playerId: id } })
  const user = await prisma.user.findFirst({ where:{ playerId: id }})
  if (user) await prisma.user.delete({ where:{ id: user.id } })
  await prisma.player.delete({ where:{ id } })
  return NextResponse.redirect(new URL('/admin?tab=players', req.url))
}
