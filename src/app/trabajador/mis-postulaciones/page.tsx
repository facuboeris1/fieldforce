import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'
import { createRating } from '@/actions/ratings'

export default async function MyApplicationsPage() {
  const session = await getSession()
  if (!session || session.userType !== 'worker') redirect('/auth/login')

  const worker = await prisma.worker.findUnique({ where: { userId: session.userId } })
  if (!worker) redirect('/auth/login')

  const applications = await prisma.application.findMany({
    where: { workerId: worker.id },
    include: {
      offer: { include: { producer: true } },
      hiring: { include: { ratings: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis postulaciones</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-3">Todavía no te postulaste a ninguna oferta</p>
          <Link href="/trabajador/dashboard" className="text-green-600 font-medium hover:underline">
            Explorar ofertas →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const days = Math.ceil(
              (app.offer.endDate.getTime() - app.offer.startDate.getTime()) / (1000 * 60 * 60 * 24)
            )
            const hiringCompleted = app.hiring?.status === 'completed'
            const alreadyRated = app.hiring?.ratings.some((r) => r.raterId === session.userId)
            const producerUserId = app.offer.producer.userId

            return (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{app.offer.taskType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(app.status)}`}>
                        {statusLabel(app.status, 'application')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{app.offer.producer.farmName} · {app.offer.province}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(app.offer.startDate)} – {formatDate(app.offer.endDate)} · {days} días
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(app.offer.dailyWage)}<span className="text-xs text-gray-400 font-normal">/día</span></p>
                  </div>
                </div>

                {app.hiring && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-3">
                      <div>Monto total: <span className="font-medium text-gray-900">{formatCurrency(app.hiring.totalAmount)}</span></div>
                      <div>Estado: <span className="font-medium text-green-700">{statusLabel(app.hiring.status, 'hiring')}</span></div>
                    </div>

                    {hiringCompleted && !alreadyRated && (
                      <details className="mt-2">
                        <summary className="text-xs text-yellow-600 border border-yellow-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-yellow-50 inline-flex">
                          Calificar productor
                        </summary>
                        <form
                          action={createRating.bind(null, app.hiring.id, producerUserId)}
                          className="mt-2 space-y-2 p-3 border border-gray-100 rounded-xl bg-gray-50"
                        >
                          <select name="stars" required className="input text-sm">
                            <option value="">Puntuación</option>
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>{n} estrellas</option>
                            ))}
                          </select>
                          <textarea name="comment" rows={2} placeholder="Comentario (opcional)" className="input text-sm resize-none" />
                          <button type="submit" className="w-full text-xs bg-yellow-500 text-white py-1.5 rounded-lg hover:bg-yellow-600">
                            Enviar calificación
                          </button>
                        </form>
                      </details>
                    )}

                    {alreadyRated && (
                      <p className="text-xs text-gray-400 mt-2">✓ Ya calificaste esta experiencia</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
