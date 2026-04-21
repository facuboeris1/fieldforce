import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mb-8">¿Cómo vas a usar FieldForce?</p>

        <div className="grid gap-4">
          <Link
            href="/auth/register/productor"
            className="block p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 transition-colors text-left"
          >
            <div className="text-3xl mb-2">🌾</div>
            <div className="font-semibold text-gray-900">Soy productor</div>
            <div className="text-sm text-gray-500 mt-1">
              Publico ofertas de trabajo estacional y contrato trabajadores
            </div>
          </Link>

          <Link
            href="/auth/register/trabajador"
            className="block p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 transition-colors text-left"
          >
            <div className="text-3xl mb-2">👷</div>
            <div className="font-semibold text-gray-900">Soy trabajador</div>
            <div className="text-sm text-gray-500 mt-1">
              Busco trabajo rural por temporada: cosecha, fumigación, poda y más
            </div>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}
