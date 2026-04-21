import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'

export default async function ProducerDashboard() {
  const session = await getSession()
  if (!session || session.userType !== 'producer') redirect('/auth/login')

  const producer = await prisma.producer.findUnique({
    where: { userId: session.userId },
    include: {
      offers: {
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } },
      },
    },
  })

  if (!producer) redirect('/auth/login')

  const totalHirings = await prisma.hiring.count({
    where: { application: { offer: { producerId: producer.id } } },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{producer.farmName}</h1>
          <p className="text-sm text-gray-500">{producer.province} · {totalHirings} contrataciones realizadas</p>
        </div>
        <Link
          href="/productor/ofertas/nueva"
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Nueva oferta
        </Link>
      </div>

      {producer.offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-500 mb-4">Todavía no publicaste ninguna oferta</p>
          <Link href="/productor/ofertas/nueva" className="text-green-600 font-medium hover:underline">
            Crear tu primera oferta →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {producer.offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/productor/ofertas/${offer.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(offer.status)}`}>
                      {statusLabel(offer.status, 'offer')}
                    </span>
                    <span className="text-xs text-gray-400">{offer.taskType}</span>
                  </div>
                  <p className="font-medium text-gray-900 truncate">{offer.location}, {offer.province}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {formatDate(offer.startDate)} – {formatDate(offer.endDate)} · {offer.workersNeeded} trabajadores
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900">{formatCurrency(offer.dailyWage)}<span className="text-xs text-gray-400 font-normal">/día</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{offer._count.applications} postulaciones</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
