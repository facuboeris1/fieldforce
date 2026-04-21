'use server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function applyToOffer(offerId: string, formData: FormData): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'worker') throw new Error('No autorizado')

  const worker = await prisma.worker.findUnique({ where: { userId: session.userId } })
  if (!worker) throw new Error('Perfil de trabajador no encontrado')

  const existing = await prisma.application.findUnique({
    where: { offerId_workerId: { offerId, workerId: worker.id } },
  })
  if (existing) throw new Error('Ya te postulaste a esta oferta')

  const message = formData.get('message') as string | null

  await prisma.application.create({
    data: { offerId, workerId: worker.id, message: message || null },
  })

  revalidatePath(`/trabajador/oferta/${offerId}`)
  revalidatePath('/trabajador/mis-postulaciones')
  redirect('/trabajador/mis-postulaciones')
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'seen' | 'accepted' | 'rejected'
): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'producer') throw new Error('No autorizado')

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  })

  revalidatePath(`/productor/ofertas/${application.offerId}`)
}
