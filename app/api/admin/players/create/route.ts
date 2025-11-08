
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

function aliasFromName(name: string) {
  const handle = name.trim().toLowerCase().replace(/\s+/g,'')
  return `${handle}@sambakings.cz`
}

export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get('name') ?? '')
  let email = String(form.get('email') ?? '')
  if (!name) return NextResponse.json({ error:'Chybí jméno.' }, { status: 400 })
  if (!email) email = aliasFromName(name)
  const player = await prisma.player.create({ data:{ name } })
  await prisma.user.create({
    data: { email: email.toLowerCase(), role:'PLAYER', playerId: player.id }
  })
  return NextResponse.redirect(new URL('/admin?tab=players', req.url))
}
