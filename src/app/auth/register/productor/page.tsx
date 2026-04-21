import Link from 'next/link'
import { registerProducer } from '@/actions/auth'
import { SubmitButton } from '@/components/SubmitButton'
import { PROVINCES, CROP_TYPES } from '@/lib/utils'

export default function RegisterProducerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/auth/register" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de productor</h1>
      <p className="text-sm text-gray-500 mb-6">Creá tu perfil para publicar ofertas de trabajo</p>

      <form action={registerProducer} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="tu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input name="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de explotación</label>
          <input name="farmName" type="text" required className="input" placeholder="Ej: Establecimiento San Jorge" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
          <select name="province" required className="input">
            <option value="">Seleccioná una provincia</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de cultivo principales</label>
          <div className="grid grid-cols-2 gap-2">
            {CROP_TYPES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="cropTypes" value={c} className="rounded" />
                {c}
              </label>
            ))}
          </div>
        </div>
        <SubmitButton label="Crear cuenta" loadingLabel="Creando cuenta…" />
      </form>
    </div>
  )
}
