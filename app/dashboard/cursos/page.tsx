import { db } from "@/lib/db"
import Link from "next/link"
import { SUBJECTS } from "@/lib/utils"

const SUBJECT_EMOJI: Record<string, string> = {
  "Matemática": "📐",
  "Lenguaje": "📚",
  "Ciencias": "🔬",
  "Inglés": "🌎",
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; level?: string }>
}) {
  const params = await searchParams
  const { subject, level } = params

  const courses = await db.course.findMany({
    where: {
      published: true,
      ...(subject && { subject }),
      ...(level && { level }),
    },
    include: { videos: { select: { id: true } } },
    orderBy: [{ subject: "asc" }, { level: "asc" }],
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Cursos</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard/cursos"
          className={`rounded-full px-4 py-2 text-sm font-medium ${!subject ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Todos
        </Link>
        {SUBJECTS.map((s) => (
          <Link
            key={s}
            href={`/dashboard/cursos?subject=${s}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${subject === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {SUBJECT_EMOJI[s]} {s}
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">No hay cursos disponibles aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/cursos/${course.id}`}
              className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-300 transition-all"
            >
              <div className="mb-3 text-4xl">{SUBJECT_EMOJI[course.subject] || "📖"}</div>
              <h3 className="mb-1 font-bold text-slate-900">{course.title}</h3>
              <p className="mb-3 text-sm text-slate-500 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{course.level}</span>
                <span>{course.videos.length} videos</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
