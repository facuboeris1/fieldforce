'use server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const COMMISSION_RATE = 0.08

export async function confirmHiring(applicationId: string): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'producer') throw new Error('No autorizado')

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offer: true, hiring: true },
  })

  if (!application) throw new Error('Postulación no encontrada')
  if (application.hiring) throw new Error('Ya existe una contratación para esta postulación')

  const days = Math.ceil(
    (application.offer.endDate.getTime() - application.offer.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const totalAmount = application.offer.dailyWage * days
  const commission = totalAmount * COMMISSION_RATE

  await prisma.$transaction([
    prisma.application.update({ where: { id: applicationId }, data: { status: 'accepted' } }),
    prisma.hiring.create({
      data: { applicationId, totalAmount, commission },
    }),
  ])

  revalidatePath(`/productor/ofertas/${application.offerId}`)
}

export async function completeHiring(hiringId: string): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'producer') throw new Error('No autorizado')

  await prisma.hiring.update({ where: { id: hiringId }, data: { status: 'completed' } })
  revalidatePath('/productor/dashboard')
}
