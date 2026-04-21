import Link from 'next/link'
import { registerWorker } from '@/actions/auth'
import { SubmitButton } from '@/components/SubmitButton'
import { PROVINCES, TASK_TYPES, MONTHS } from '@/lib/utils'

export default function RegisterWorkerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/auth/register" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de trabajador</h1>
      <p className="text-sm text-gray-500 mb-6">Creá tu perfil para que los productores te encuentren</p>

      <form action={registerWorker} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input name="name" type="text" required className="input" placeholder="Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
            <input name="dni" type="text" required className="input" placeholder="12345678" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input name="phone" type="tel" required className="input" placeholder="011 1234-5678" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="tu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input name="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia de residencia</label>
          <select name="province" required className="input">
            <option value="">Seleccioná una provincia</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades</label>
          <div className="grid grid-cols-2 gap-2">
            {TASK_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="skills" value={t} className="rounded" />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad mensual</label>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m) => (
              <label key={m.value} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="availabilityMonths" value={m.value} className="rounded" />
                {m.label}
              </label>
            ))}
          </div>
        </div>
        <SubmitButton label="Crear cuenta" loadingLabel="Creando cuenta…" />
      </form>
    </div>
  )
}
