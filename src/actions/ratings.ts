'use server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function createRating(hiringId: string, ratedUserId: string, formData: FormData): Promise<void> {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  const stars = parseInt(formData.get('stars') as string)
  const comment = formData.get('comment') as string | null

  if (!stars || stars < 1 || stars > 5) throw new Error('Puntuación inválida')

  const existing = await prisma.rating.findUnique({
    where: { hiringId_raterId: { hiringId, raterId: session.userId } },
  })
  if (existing) throw new Error('Ya enviaste una calificación para esta contratación')

  await prisma.rating.create({
    data: {
      hiringId,
      raterId: session.userId,
      ratedId: ratedUserId,
      stars,
      comment: comment || null,
    },
  })

  revalidatePath('/productor/dashboard')
  revalidatePath('/trabajador/mis-postulaciones')
}
