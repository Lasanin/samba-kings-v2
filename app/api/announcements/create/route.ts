
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const body = String(form.get('body') ?? '').trim()
  if (!body) return NextResponse.redirect(new URL('/', req.url))
  await prisma.announcement.create({ data: { body } })
  return NextResponse.redirect(new URL('/', req.url))
}
