import { auth } from "@/lib/auth"
import Link from "next/link"
import { formatPrice, formatDateTime } from "@/lib/utils"
import { mockCourses, mockClasses } from "@/lib/mock-data"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const isTeacher = session.user.role === "TEACHER"

  if (isTeacher) {
    return (
      <div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Bienvenido, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="mb-8 text-slate-500">Panel de docente — Matemática</p>

        <div className="mb-8 grid grid-cols-3 gap-6">
          <StatCard title="Clases programadas" value={3} />
          <StatCard title="Clases completadas" value={12} />
          <StatCard title="Alumnos este mes" value={8} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Próximas clases</h2>
            <Link href="/dashboard/disponibilidad" className="text-sm text-blue-600 hover:underline">
              + Agregar horario
            </Link>
          </div>
          <div className="space-y-3">
            {mockClasses.slice(0, 3).map((cls) => (
              <div key={cls.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">{cls.subject}</p>
                  <p className="text-sm text-slate-500">{formatDateTime(cls.scheduledAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {cls.bookings.length}/{cls.maxStudents} alumnos
                  </p>
                  <p className="text-sm text-slate-500">{formatPrice(cls.hourlyRate)}/hr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Hola, {session.user.name?.split(" ")[0]} 👋
      </h1>
      <p className="mb-8 text-slate-500">Nivel: PAES</p>

      <div className="mb-8 rounded-xl bg-blue-50 border border-blue-200 p-6">
        <h2 className="mb-2 text-lg font-bold text-blue-900">Activa tu membresía</h2>
        <p className="mb-4 text-sm text-blue-700">
          Accede a todos los cursos, videos y guías por solo {formatPrice(9990)}/mes.
        </p>
        <Link
          href="#planes"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ver planes
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard title="Cursos disponibles" value={mockCourses.length} />
        <StatCard title="Videos en total" value={mockCourses.reduce((a, c) => a + c.videos.length, 0)} />
        <StatCard title="Clases disponibles" value={mockClasses.length} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Cursos destacados</h2>
          <Link href="/dashboard/cursos" className="text-sm text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {mockCourses.slice(0, 4).map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/cursos/${course.id}`}
              className="rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-slate-900">{course.title}</p>
              <p className="text-sm text-slate-500">
                {course.subject} · {course.level} · {course.videos.length} videos
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
