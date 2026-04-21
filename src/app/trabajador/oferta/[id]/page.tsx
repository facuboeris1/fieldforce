import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { applyToOffer } from '@/actions/applications'
import { SubmitButton } from '@/components/SubmitButton'

export default async function OfferDetailWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session || session.userType !== 'worker') redirect('/auth/login')

  const worker = await prisma.worker.findUnique({ where: { userId: session.userId } })
  if (!worker) redirect('/auth/login')

  const offer = await prisma.jobOffer.findUnique({
    where: { id },
    include: { producer: true },
  })
  if (!offer || offer.status !== 'published') notFound()

  const existing = await prisma.application.findUnique({
    where: { offerId_workerId: { offerId: id, workerId: worker.id } },
  })

  const days = Math.ceil(
    (offer.endDate.getTime() - offer.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalEarning = offer.dailyWage * days

  const applyAction = applyToOffer.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/trabajador/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Volver a ofertas
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{offer.taskType}</h1>
          <p className="text-gray-500">{offer.producer.farmName}</p>
          <p className="text-sm text-gray-400">{offer.location}, {offer.province}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-1">Jornal diario</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(offer.dailyWage)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-1">Ganancia estimada</div>
            <div className="text-xl font-bold text-green-700">{formatCurrency(totalEarning)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-1">Período</div>
            <div className="font-medium text-gray-900">{formatDate(offer.startDate)} – {formatDate(offer.endDate)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-1">Puestos disponibles</div>
            <div className="font-medium text-gray-900">{offer.workersNeeded} trabajadores</div>
          </div>
        </div>
      </div>

      {existing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-blue-700 font-medium">Ya te postulaste a esta oferta</p>
          <p className="text-sm text-blue-500 mt-1">Podés ver el estado en tus postulaciones</p>
          <Link href="/trabajador/mis-postulaciones" className="mt-3 inline-block text-sm text-blue-700 hover:underline">
            Ver mis postulaciones →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Postularme a esta oferta</h2>
          <form action={applyAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de presentación <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Contale al productor tu experiencia y por qué sos el indicado..."
                className="input resize-none"
              />
            </div>
            <SubmitButton label="Enviar postulación" loadingLabel="Enviando…" />
          </form>
        </div>
      )}
    </div>
  )
}
