
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const trainingId = String(form.get('trainingId') ?? '')
  if (!trainingId) return NextResponse.json({ error:'Chybí data.' }, { status: 400 })
  await prisma.payment.updateMany({
    where:{ trainingId, status: 'PENDING' },
    data:{ status: 'CONFIRMED' }
  })
  return NextResponse.redirect(new URL(`/trainings/${trainingId}`, req.url))
}
