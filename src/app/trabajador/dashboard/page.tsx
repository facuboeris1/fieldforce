import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, statusColor, statusLabel } from '@/lib/utils'
import { PROVINCES, TASK_TYPES } from '@/lib/utils'

export default async function WorkerDashboard({
  searchParams,
}: {
  searchParams: Promise<{ provincia?: string; tarea?: string; jornalMin?: string }>
}) {
  const session = await getSession()
  if (!session || session.userType !== 'worker') redirect('/auth/login')

  const filters = await searchParams
  const { provincia, tarea, jornalMin } = filters

  const worker = await prisma.worker.findUnique({ where: { userId: session.userId } })
  if (!worker) redirect('/auth/login')

  const workerMonths = JSON.parse(worker.availabilityMonths || '[]') as string[]

  const offers = await prisma.jobOffer.findMany({
    where: {
      status: 'published',
      ...(provincia ? { province: provincia } : {}),
      ...(tarea ? { taskType: tarea } : {}),
      ...(jornalMin ? { dailyWage: { gte: parseFloat(jornalMin) } } : {}),
    },
    include: {
      producer: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const myApplications = await prisma.application.findMany({
    where: { workerId: worker.id },
    select: { offerId: true },
  })
  const appliedOfferIds = new Set(myApplications.map((a) => a.offerId))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ofertas disponibles</h1>
        <Link href="/trabajador/mis-postulaciones" className="text-sm text-green-600 hover:underline">
          Mis postulaciones →
        </Link>
      </div>

      <form className="flex gap-2 flex-wrap mb-6">
        <select name="provincia" defaultValue={provincia ?? ''} className="input text-sm flex-1 min-w-[150px]">
          <option value="">Todas las provincias</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select name="tarea" defaultValue={tarea ?? ''} className="input text-sm flex-1 min-w-[150px]">
          <option value="">Todas las tareas</option>
          {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          name="jornalMin"
          type="number"
          defaultValue={jornalMin ?? ''}
          placeholder="Jornal mínimo"
          className="input text-sm flex-1 min-w-[130px]"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          Filtrar
        </button>
        {(provincia || tarea || jornalMin) && (
          <Link href="/trabajador/dashboard" className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            Limpiar
          </Link>
        )}
      </form>

      {offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          No hay ofertas que coincidan con tu búsqueda
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const applied = appliedOfferIds.has(offer.id)
            const offerMonth = new Date(offer.startDate).getMonth() + 1
            const compatible = workerMonths.includes(String(offerMonth))

            return (
              <Link
                key={offer.id}
                href={`/trabajador/oferta/${offer.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-gray-900">{offer.taskType}</span>
                      {compatible && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Compatible con tu disponibilidad
                        </span>
                      )}
                      {applied && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Ya te postulaste
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{offer.producer.farmName} · {offer.province}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(offer.startDate)} – {formatDate(offer.endDate)} · {offer.workersNeeded} puestos
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(offer.dailyWage)}<span className="text-xs text-gray-400 font-normal">/día</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">{offer._count.applications} postulantes</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
