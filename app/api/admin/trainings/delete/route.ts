
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const id = String(form.get('id') ?? '')
  if (!id) return NextResponse.json({ error: 'Chybí ID.' }, { status: 400 })
  await prisma.payment.deleteMany({ where:{ trainingId: id } })
  await prisma.trainingConfirmation.deleteMany({ where:{ trainingId: id } })
  await prisma.training.delete({ where:{ id } })
  return NextResponse.redirect(new URL('/admin?tab=trainings', req.url))
}
