import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { formatPrice, formatDateTime } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const isTeacher = session.user.role === "TEACHER"

  if (isTeacher) {
    const teacher = await db.teacherProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        classes: {
          where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } },
          include: { bookings: true },
          orderBy: { scheduledAt: "asc" },
          take: 5,
        },
      },
    })

    const totalClasses = await db.virtualClass.count({ where: { teacherId: teacher?.id } })
    const completedClasses = await db.virtualClass.count({
      where: { teacherId: teacher?.id, status: "COMPLETED" },
    })

    return (
      <div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Bienvenido, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="mb-8 text-slate-500">Panel de docente — {teacher?.subject}</p>

        <div className="mb-8 grid grid-cols-3 gap-6">
          <StatCard title="Clases programadas" value={teacher?.classes.length ?? 0} />
          <StatCard title="Clases completadas" value={completedClasses} />
          <StatCard title="Total clases" value={totalClasses} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Próximas clases</h2>
            <Link href="/dashboard/disponibilidad" className="text-sm text-blue-600 hover:underline">
              + Agregar horario
            </Link>
          </div>
          {teacher?.classes.length === 0 ? (
            <p className="text-sm text-slate-500">No tienes clases programadas aún.</p>
          ) : (
            <div className="space-y-3">
              {teacher?.classes.map((cls) => (
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
          )}
        </div>
      </div>
    )
  }

  // Vista de alumno
  const student = await db.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      bookings: {
        where: { class: { scheduledAt: { gte: new Date() } } },
        include: {
          class: {
            include: { teacher: { include: { user: { select: { name: true } } } } },
          },
        },
        orderBy: { class: { scheduledAt: "asc" } },
        take: 3,
      },
    },
  })

  const hasSubscription = student?.subscriptionEndsAt
    ? new Date(student.subscriptionEndsAt) > new Date()
    : false

  const courses = await db.course.findMany({
    where: { published: true },
    include: { videos: { select: { id: true } } },
    take: 4,
  })

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Hola, {session.user.name?.split(" ")[0]} 👋
      </h1>
      <p className="mb-8 text-slate-500">Nivel: {student?.gradeLevel}</p>

      {!hasSubscription && (
        <div className="mb-8 rounded-xl bg-blue-50 border border-blue-200 p-6">
          <h2 className="mb-2 text-lg font-bold text-blue-900">Activa tu membresía</h2>
          <p className="mb-4 text-sm text-blue-700">
            Accede a todos los cursos, videos y guías por solo {formatPrice(9990)}/mes.
          </p>
          <Link
            href="/dashboard/perfil#planes"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ver planes
          </Link>
        </div>
      )}

      {/* Próximas clases */}
      {student?.bookings && student.bookings.length > 0 && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Próximas clases</h2>
          <div className="space-y-3">
            {student.bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">{booking.class.subject}</p>
                  <p className="text-sm text-slate-500">
                    Prof. {booking.class.teacher.user.name} · {formatDateTime(booking.class.scheduledAt)}
                  </p>
                </div>
                {booking.class.dailyRoomUrl && (
                  <a
                    href={booking.class.dailyRoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Entrar
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Cursos disponibles</h2>
          <Link href="/dashboard/cursos" className="text-sm text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>
        {courses.length === 0 ? (
          <p className="text-sm text-slate-500">Pronto habrá cursos disponibles.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/cursos/${course.id}`}
                className="rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="font-medium text-slate-900">{course.title}</p>
                <p className="text-sm text-slate-500">
                  {course.subject} · {course.level} · {course.videos.length} videos
                </p>
              </Link>
            ))}
          </div>
        )}
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
