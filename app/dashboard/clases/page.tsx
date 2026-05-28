import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { formatPrice, formatDateTime, SUBJECTS } from "@/lib/utils"

export default async function ClasesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const params = await searchParams
  const { subject } = params
  const session = await auth()

  const classes = await db.virtualClass.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: new Date() },
      ...(subject && { subject }),
    },
    include: {
      teacher: {
        include: { user: { select: { name: true, avatar: true } } },
      },
      bookings: { select: { id: true } },
    },
    orderBy: { scheduledAt: "asc" },
  })

  // Bookings del alumno actual
  const student = await db.studentProfile.findUnique({
    where: { userId: session!.user.id },
    select: { id: true, subscriptionEndsAt: true },
  })

  const myBookingIds = await db.classBooking.findMany({
    where: { studentId: student?.id },
    select: { classId: true },
  })
  const bookedClassIds = new Set(myBookingIds.map((b) => b.classId))

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Clases en Vivo</h1>
      <p className="mb-6 text-slate-500">Reserva una sesión 1:1 con un docente.</p>

      {/* Filtros */}
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

      {classes.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">No hay clases disponibles en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => {
            const isFull = cls.bookings.length >= cls.maxStudents
            const isBooked = bookedClassIds.has(cls.id)

            return (
              <div key={cls.id} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="font-bold text-slate-900">{cls.subject}</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {cls.duration} min
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Prof. {cls.teacher.user.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDateTime(cls.scheduledAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {cls.bookings.length}/{cls.maxStudents} alumno(s) · {formatPrice(cls.hourlyRate)}/hr
                    </p>
                  </div>

                  <div>
                    {isBooked ? (
                      <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                        Reservada ✓
                      </span>
                    ) : isFull ? (
                      <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                        Sin cupos
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/clases/${cls.id}/reservar`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Reservar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
