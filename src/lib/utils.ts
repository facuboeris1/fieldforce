export const TASK_TYPES = [
  'Cosecha manual',
  'Tractorista',
  'Fumigador',
  'Poda',
  'Riego',
  'Siembra',
  'Empaque',
  'Otros',
]

export const CROP_TYPES = [
  'Soja',
  'Maíz',
  'Trigo',
  'Girasol',
  'Vid',
  'Frutales',
  'Hortalizas',
  'Otros',
]

export const PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

export const MONTHS = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function statusLabel(status: string, type: 'offer' | 'application' | 'hiring') {
  if (type === 'offer') {
    return { draft: 'Borrador', published: 'Publicada', closed: 'Cerrada' }[status] ?? status
  }
  if (type === 'application') {
    return { sent: 'Enviada', seen: 'Vista', accepted: 'Aceptada', rejected: 'Rechazada' }[status] ?? status
  }
  return { active: 'Activa', completed: 'Completada' }[status] ?? status
}

export function statusColor(status: string) {
  return {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700',
    sent: 'bg-blue-100 text-blue-700',
    seen: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
  }[status] ?? 'bg-gray-100 text-gray-600'
}
