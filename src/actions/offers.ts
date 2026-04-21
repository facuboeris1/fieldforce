'use server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOffer(formData: FormData): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'producer') throw new Error('No autorizado')

  const producer = await prisma.producer.findUnique({ where: { userId: session.userId } })
  if (!producer) throw new Error('Perfil de productor no encontrado')

  const taskType = formData.get('taskType') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const workersNeeded = parseInt(formData.get('workersNeeded') as string)
  const dailyWage = parseFloat(formData.get('dailyWage') as string)
  const location = formData.get('location') as string
  const province = formData.get('province') as string
  const publish = formData.get('publish') === 'true'

  if (!taskType || !startDate || !endDate || !workersNeeded || !dailyWage || !location || !province) {
    throw new Error('Todos los campos son obligatorios')
  }

  const offer = await prisma.jobOffer.create({
    data: {
      producerId: producer.id,
      taskType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      workersNeeded,
      dailyWage,
      location,
      province,
      status: publish ? 'published' : 'draft',
    },
  })

  revalidatePath('/productor/dashboard')
  redirect(`/productor/ofertas/${offer.id}`)
}

export async function updateOfferStatus(offerId: string, status: 'published' | 'closed'): Promise<void> {
  const session = await getSession()
  if (!session || session.userType !== 'producer') throw new Error('No autorizado')

  const producer = await prisma.producer.findUnique({ where: { userId: session.userId } })
  if (!producer) throw new Error('No encontrado')

  const offer = await prisma.jobOffer.findFirst({ where: { id: offerId, producerId: producer.id } })
  if (!offer) throw new Error('Oferta no encontrada')

  await prisma.jobOffer.update({ where: { id: offerId }, data: { status } })

  revalidatePath('/productor/dashboard')
  revalidatePath(`/productor/ofertas/${offerId}`)
}
