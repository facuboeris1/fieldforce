import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createOffer } from '@/actions/offers'
import { SubmitButton } from '@/components/SubmitButton'
import { TASK_TYPES, PROVINCES } from '@/lib/utils'

export default async function NewOfferPage() {
  const session = await getSession()
  if (!session || session.userType !== 'producer') redirect('/auth/login')

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/productor/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Volver al dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nueva oferta de trabajo</h1>
      <p className="text-sm text-gray-500 mb-6">Completá los datos para publicar tu oferta</p>

      <form action={createOffer} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de tarea</label>
            <select name="taskType" required className="input">
              <option value="">Seleccioná el tipo</option>
              {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input name="startDate" type="date" required min={today} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input name="endDate" type="date" required min={today} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de trabajadores</label>
            <input name="workersNeeded" type="number" required min={1} className="input" placeholder="Ej: 5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jornal diario (ARS)</label>
            <input name="dailyWage" type="number" required min={1} className="input" placeholder="Ej: 15000" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación del campo</label>
            <input name="location" type="text" required className="input" placeholder="Ej: Ruta 8 km 145, San Nicolás" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <select name="province" required className="input">
              <option value="">Seleccioná provincia</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            name="publish"
            value="false"
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Guardar borrador
          </button>
          <button
            type="submit"
            name="publish"
            value="true"
            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Publicar oferta
          </button>
        </div>
      </form>
    </div>
  )
}
