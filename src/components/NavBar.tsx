import Link from 'next/link'
import { logout } from '@/actions/auth'
import { getSession } from '@/lib/session'

export async function NavBar() {
  const session = await getSession()

  const links =
    session?.userType === 'producer'
      ? [
          { href: '/productor/dashboard', label: 'Mis ofertas' },
          { href: '/productor/ofertas/nueva', label: '+ Nueva oferta' },
        ]
      : session?.userType === 'worker'
        ? [
            { href: '/trabajador/dashboard', label: 'Buscar trabajo' },
            { href: '/trabajador/mis-postulaciones', label: 'Mis postulaciones' },
          ]
        : []

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-green-700 text-lg tracking-tight">
          FieldForce
        </Link>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-green-700">
              {l.label}
            </Link>
          ))}
          {session ? (
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-400 hover:text-red-600">
                Salir
              </button>
            </form>
          ) : (
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-green-700">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
