"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SUBJECTS } from "@/lib/utils"

export default function DisponibilidadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const form = e.currentTarget
    const subject = (form.elements.namedItem("subject") as HTMLSelectElement).value
    const scheduledAt = (form.elements.namedItem("scheduledAt") as HTMLInputElement).value
    const duration = parseInt((form.elements.namedItem("duration") as HTMLSelectElement).value)
    const maxStudents = parseInt((form.elements.namedItem("maxStudents") as HTMLSelectElement).value)

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, scheduledAt, duration, maxStudents }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al crear la clase")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    form.reset()
    router.refresh()
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Disponibilidad</h1>
      <p className="mb-8 text-slate-500">Agrega horarios disponibles para clases en vivo.</p>

      <div className="max-w-lg rounded-xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-slate-900">Agregar horario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Materia</label>
            <select
              name="subject"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Fecha y hora</label>
            <input
              name="scheduledAt"
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Duración</label>
            <select
              name="duration"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Máximo de alumnos</label>
            <select
              name="maxStudents"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="1">1 alumno (clase individual)</option>
              <option value="3">3 alumnos (grupo pequeño)</option>
              <option value="5">5 alumnos (grupo)</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
              Clase agregada correctamente ✓
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Agregar horario"}
          </button>
        </form>
      </div>
    </div>
  )
}
