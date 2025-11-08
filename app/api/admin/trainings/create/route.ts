
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const date = String(form.get('date') ?? '')
  const price = Number(form.get('price') ?? 0)
  if (!date || !price) return NextResponse.json({ error: 'Chybí data.' }, { status: 400 })
  const training = await prisma.training.create({ data: { date: new Date(date), price } })
  const players = await prisma.player.findMany()
  await prisma.$transaction(async (tx)=>{
    for (const p of players) {
      await tx.trainingConfirmation.create({ data: { playerId: p.id, trainingId: training.id, attended: false } })
    }
  })
  return NextResponse.redirect(new URL('/admin?tab=trainings', req.url))
}
