
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const id = String(form.get('id') ?? '')
  const price = Number(form.get('price') ?? 0)
  if (!id) return NextResponse.json({ error: 'Chybí data.' }, { status: 400 })
  await prisma.training.update({ where:{ id }, data:{ price } })
  return NextResponse.redirect(new URL(`/trainings/${id}`, req.url))
}
