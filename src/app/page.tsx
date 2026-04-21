import Link from 'next/link'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getSession()
  if (session?.userType === 'producer') redirect('/productor/dashboard')
  if (session?.userType === 'worker') redirect('/trabajador/dashboard')

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Trabajo agrícola,<br />
          <span className="text-green-600">cuando lo necesitás</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          FieldForce conecta productores agrícolas con trabajadores rurales para cosecha, poda, fumigación y más.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/register?tipo=productor"
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors"
          >
            Soy productor
          </Link>
          <Link
            href="/auth/register?tipo=trabajador"
            className="bg-white text-green-700 border-2 border-green-600 px-8 py-3 rounded-xl font-medium text-lg hover:bg-green-50 transition-colors"
          >
            Busco trabajo
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="text-green-600 hover:underline">
            Ingresar
          </Link>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: '🌾',
            title: 'Publicá tu oferta',
            desc: 'Cargá el tipo de tarea, fechas y jornal. En minutos llega a cientos de trabajadores.',
          },
          {
            icon: '🔍',
            title: 'Encontrá trabajo',
            desc: 'Filtrá por provincia, tarea y disponibilidad. Postulate con un click.',
          },
          {
            icon: '⭐',
            title: 'Sistema de reputación',
            desc: 'Valoraciones mutuas para que productores y trabajadores se elijan con confianza.',
          },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
