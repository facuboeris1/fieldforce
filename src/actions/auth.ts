'use server'
import { prisma } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function registerProducer(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const farmName = formData.get('farmName') as string
  const province = formData.get('province') as string
  const cropTypes = formData.getAll('cropTypes') as string[]

  if (!email || !password || !farmName || !province) {
    throw new Error('Todos los campos son obligatorios')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('El email ya está registrado')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      type: 'producer',
      producer: {
        create: { farmName, province, cropTypes: JSON.stringify(cropTypes) },
      },
    },
  })

  await createSession(user.id, 'producer')
  redirect('/productor/dashboard')
}

export async function registerWorker(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const dni = formData.get('dni') as string
  const phone = formData.get('phone') as string
  const province = formData.get('province') as string
  const skills = formData.getAll('skills') as string[]
  const availabilityMonths = formData.getAll('availabilityMonths') as string[]

  if (!email || !password || !name || !dni || !phone || !province) {
    throw new Error('Todos los campos son obligatorios')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('El email ya está registrado')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      type: 'worker',
      worker: {
        create: {
          name,
          dni,
          phone,
          province,
          skills: JSON.stringify(skills),
          availabilityMonths: JSON.stringify(availabilityMonths),
        },
      },
    },
  })

  await createSession(user.id, 'worker')
  redirect('/trabajador/dashboard')
}

export async function login(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Credenciales inválidas')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Credenciales inválidas')

  await createSession(user.id, user.type as 'producer' | 'worker')

  if (user.type === 'producer') redirect('/productor/dashboard')
  else redirect('/trabajador/dashboard')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/auth/login')
}
