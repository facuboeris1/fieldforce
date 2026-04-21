import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'
import { updateOfferStatus } from '@/actions/offers'
import { updateApplicationStatus } from '@/actions/applications'
import { confirmHiring, completeHiring } from '@/actions/hirings'
import { createRating } from '@/actions/ratings'

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session || session.userType !== 'producer') redirect('/auth/login')

  const producer = await prisma.producer.findUnique({ where: { userId: session.userId } })
  if (!producer) redirect('/auth/login')

  const offer = await prisma.jobOffer.findFirst({
    where: { id, producerId: producer.id },
    include: {
      applications: {
        include: {
          worker: { include: { user: true } },
          hiring: { include: { ratings: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!offer) notFound()

  const days = Math.ceil(
    (offer.endDate.getTime() - offer.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalPerWorker = offer.dailyWage * days

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/productor/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Volver
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(offer.status)}`}>
              {statusLabel(offer.status, 'offer')}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">{offer.taskType}</h1>
            <p className="text-gray-500 text-sm">{offer.location}, {offer.province}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{formatCurrency(offer.dailyWage)}<span className="text-sm text-gray-400 font-normal">/día</span></p>
            <p className="text-xs text-gray-400">{days} días · Total: {formatCurrency(totalPerWorker)}/trabajador</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 pt-4 border-t border-gray-100">
          <div>📅 {formatDate(offer.startDate)} → {formatDate(offer.endDate)}</div>
          <div>👥 {offer.workersNeeded} trabajadores necesarios</div>
        </div>
        {offer.status !== 'closed' && (
          <div className="flex gap-2 mt-4">
            {offer.status === 'draft' && (
              <form action={updateOfferStatus.bind(null, offer.id, 'published')}>
                <button type="submit" className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">
                  Publicar
                </button>
              </form>
            )}
            <form action={updateOfferStatus.bind(null, offer.id, 'closed')}>
              <button type="submit" className="text-sm border border-red-200 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-50">
                Cerrar oferta
              </button>
            </form>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Postulaciones ({offer.applications.length})
      </h2>

      {offer.applications.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400">
          Todavía no hay postulaciones para esta oferta
        </div>
      ) : (
        <div className="space-y-3">
          {offer.applications.map((app) => {
            const workerSkills = JSON.parse(app.worker.skills || '[]') as string[]
            const hasHiring = !!app.hiring
            const hiringCompleted = app.hiring?.status === 'completed'
            const alreadyRated = app.hiring?.ratings.some((r) => r.raterId === session.userId)

            return (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{app.worker.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(app.status)}`}>
                        {statusLabel(app.status, 'application')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{app.worker.province}</p>
                    {workerSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {workerSkills.map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                    {app.message && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{app.message}"</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!hasHiring && app.status !== 'rejected' && (
                      <>
                        {app.status === 'sent' && (
                          <form action={updateApplicationStatus.bind(null, app.id, 'seen')}>
                            <button type="submit" className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 w-full">
                              Marcar vista
                            </button>
                          </form>
                        )}
                        <form action={confirmHiring.bind(null, app.id)}>
                          <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 w-full">
                            Contratar
                          </button>
                        </form>
                        <form action={updateApplicationStatus.bind(null, app.id, 'rejected')}>
                          <button type="submit" className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 w-full">
                            Rechazar
                          </button>
                        </form>
                      </>
                    )}
                    {hasHiring && !hiringCompleted && (
                      <form action={completeHiring.bind(null, app.hiring!.id)}>
                        <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                          Completar temporada
                        </button>
                      </form>
                    )}
                    {hiringCompleted && !alreadyRated && (
                      <details className="relative">
                        <summary className="text-xs text-yellow-600 border border-yellow-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-yellow-50">
                          Calificar trabajador
                        </summary>
                        <form
                          action={createRating.bind(null, app.hiring!.id, app.worker.userId)}
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
                  </div>
                </div>

                {hasHiring && (
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-xs text-gray-500">
                    <div>Total: <span className="font-medium text-gray-900">{formatCurrency(app.hiring!.totalAmount)}</span></div>
                    <div>Comisión (8%): <span className="font-medium text-gray-900">{formatCurrency(app.hiring!.commission)}</span></div>
                    <div>Estado: <span className={`font-medium ${app.hiring!.status === 'completed' ? 'text-gray-600' : 'text-green-700'}`}>{statusLabel(app.hiring!.status, 'hiring')}</span></div>
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
