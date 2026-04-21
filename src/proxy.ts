import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import type { SessionPayload } from '@/lib/session'

const producerRoutes = ['/productor']
const workerRoutes = ['/trabajador']
const authRoutes = ['/auth/login', '/auth/register']

async function decryptToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = process.env.SESSION_SECRET!
    const encodedKey = new TextEncoder().encode(secretKey)
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('session')?.value
  const session = token ? await decryptToken(token) : null

  if (authRoutes.some((r) => path.startsWith(r)) && session) {
    const dest = session.userType === 'producer' ? '/productor/dashboard' : '/trabajador/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (producerRoutes.some((r) => path.startsWith(r))) {
    if (!session || session.userType !== 'producer') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  if (workerRoutes.some((r) => path.startsWith(r))) {
    if (!session || session.userType !== 'worker') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/productor/:path*', '/trabajador/:path*', '/auth/:path*'],
}
