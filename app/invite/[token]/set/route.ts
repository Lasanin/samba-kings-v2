
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const form = await req.formData()
  const token = String(form.get('token') ?? '')
  const password = String(form.get('password') ?? '')
  const inv = await prisma.invitation.findUnique({ where:{ token }, include:{ player:{ include:{ user:true } } } })
  if (!inv || inv.usedAt || inv.expiresAt < new Date()) {
    return NextResponse.json({ error:'Neplatná pozvánka.' }, { status: 400 })
  }
  const hash = await bcrypt.hash(password, 10)
  let user = inv.player.user
  if (!user) {
    await prisma.user.create({
      data:{ email: inv.emailAlias.toLowerCase(), role:'PLAYER', playerId: inv.playerId, passwordHash: hash }
    })
  } else {
    await prisma.user.update({ where:{ id: user.id }, data:{ passwordHash: hash } })
  }
  await prisma.invitation.update({ where:{ id: inv.id }, data:{ usedAt: new Date() } })
  return NextResponse.redirect(new URL('/login', req.url))
}
