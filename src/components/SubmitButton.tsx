'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
    >
      {pending ? (loadingLabel ?? 'Procesando…') : label}
    </button>
  )
}
