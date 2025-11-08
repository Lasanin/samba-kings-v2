
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const trainingId = String(form.get('trainingId') ?? '')
    const ids = form.getAll('playerIds').map(v=>String(v))
    if (!trainingId || ids.length===0) {
      return NextResponse.json({ error: 'Chybí data.' }, { status: 400 })
    }
    await prisma.$transaction(async (tx)=>{
      for (const playerId of ids) {
        try {
          await tx.trainingConfirmation.create({ data:{ playerId, trainingId, attended:false } })
        } catch (e:any) {
          // unique violation -> už tam je; ignoruj
        }
      }
    })
    return NextResponse.redirect(new URL(`/trainings/${trainingId}`, req.url))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Nepodařilo se přidat účastníky.' }, { status: 500 })
  }
}
