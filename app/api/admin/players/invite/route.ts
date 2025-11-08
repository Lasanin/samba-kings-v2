
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

function token() {
  return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
}

export async function POST(req: Request) {
  const form = await req.formData()
  const playerId = String(form.get('playerId') ?? '')
  if (!playerId) return NextResponse.json({ error:'Chybí playerId.' }, { status: 400 })
  const player = await prisma.player.findUnique({ where:{ id: playerId }, include:{ user:true } })
  if (!player) return NextResponse.json({ error:'Hráč nenalezen.' }, { status: 404 })
  const emailAlias = player.user?.email ?? `${player.name.toLowerCase().replace(/\s+/g,'')}@sambakings.cz`
  const inv = await prisma.invitation.create({
    data:{
      token: token(),
      playerId,
      emailAlias,
      expiresAt: new Date(Date.now()+7*24*3600*1000)
    }
  })
  const url = new URL(`/invite/${inv.token}`, req.url).toString()
  return NextResponse.json({ url })
}
