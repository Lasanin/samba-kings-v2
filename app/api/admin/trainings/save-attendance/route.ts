
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const trainingId = String(form.get('trainingId') ?? '')
    const attended = form.getAll('attended').map(v=>String(v))
    if (!trainingId) return NextResponse.json({ error: 'Chybí data.' }, { status: 400 })

    const training = await prisma.training.findUnique({ where:{ id: trainingId } })
    if (!training) return NextResponse.json({ error: 'Trénink nenalezen.' }, { status: 404 })

    const confirms = await prisma.trainingConfirmation.findMany({ where:{ trainingId } })
    const payments = await prisma.payment.findMany({ where:{ trainingId } })
    const byPlayer = new Map(payments.map(p=>[p.playerId, p]))

    await prisma.$transaction(async tx => {
      for (const c of confirms) {
        const isAttended = attended.includes(c.playerId)
        await tx.trainingConfirmation.update({
          where:{ playerId_trainingId: { playerId: c.playerId, trainingId } },
          data:{ attended: isAttended }
        })
        const existing = byPlayer.get(c.playerId)
        if (isAttended) {
          if (!existing) {
            await tx.payment.create({
              data:{
                playerId: c.playerId,
                trainingId,
                amount: training.price,
                kind: 'DEBIT',
                status: 'PENDING',
                note: `Trénink ${new Date(training.date).toLocaleString('cs-CZ')}`
              }
            })
          }
        } else {
          if (existing && existing.status==='PENDING') {
            await tx.payment.delete({ where:{ id: existing.id } })
          }
        }
      }
    })

    return NextResponse.redirect(new URL(`/trainings/${trainingId}`, req.url))
  } catch (e) {
    console.error('SAVE_ATTENDANCE_ERROR', e)
    return NextResponse.json({ error: 'Chyba při ukládání účasti.' }, { status: 500 })
  }
}
