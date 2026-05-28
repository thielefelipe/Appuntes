import Link from "next/link"
import { formatPrice, formatDateTime, SUBJECTS } from "@/lib/utils"
import { mockClasses } from "@/lib/mock-data"

export default async function ClasesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const params = await searchParams
  const { subject } = params

  const classes = mockClasses.filter((c) => !subject || c.subject === subject)

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Clases en Vivo</h1>
      <p className="mb-6 text-slate-500">Reserva una sesión con un docente especializado.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard/clases"
          className={`rounded-full px-4 py-2 text-sm font-medium ${!subject ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Todas
        </Link>
        {SUBJECTS.map((s) => (
          <Link
            key={s}
            href={`/dashboard/clases?subject=${s}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${subject === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {classes.map((cls) => {
          const isFull = cls.bookings.length >= cls.maxStudents

          return (
            <div key={cls.id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-bold text-slate-900">{cls.subject}</h3>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {cls.duration} min
                    </span>
                    {cls.maxStudents > 1 && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                        Grupal
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Prof. {cls.teacher.user.name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">{formatDateTime(cls.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {cls.bookings.length}/{cls.maxStudents} alumno(s) · {formatPrice(cls.hourlyRate)}/hr
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-bold text-slate-900">{formatPrice(cls.hourlyRate)}</p>
                  {isFull ? (
                    <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                      Sin cupos
                    </span>
                  ) : (
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Reservar
                    </button>
                  )}
                </div>
              </div>

              {cls.teacher.bio && (
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {cls.teacher.bio}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
