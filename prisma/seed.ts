
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPass = await bcrypt.hash('heslo123', 10)
  const adminPlayer = await prisma.player.create({ data: { name: 'Vladislav Admin', credit: 0 } })

  await prisma.user.upsert({
    where: { email: 'vladislav@sambakings.cz' },
    update: { passwordHash: adminPass, role: 'ADMIN', playerId: adminPlayer.id },
    create: {
      email: 'vladislav@sambakings.cz',
      name: 'Vladislav',
      passwordHash: adminPass,
      role: 'ADMIN',
      playerId: adminPlayer.id
    }
  })

  const names = ['Jan Skopal','Lukáš Poruban','Radek Krejza','Tomáš Hron','Tomáš Mikovec','Vojtěch Prchal']
  for (const n of names) await prisma.player.create({ data: { name: n } })

  await prisma.training.create({ data: { date: new Date(Date.now()+7*24*3600*1000), price: 100 } })
  await prisma.announcement.create({ data: { body: 'Vítej v Samba Kings v2 – tady se zobrazují aktuality.' } })
  console.log('✅ Seed complete. Admin: vladislav@sambakings.cz / heslo123')
}

main().finally(()=>prisma.$disconnect())
