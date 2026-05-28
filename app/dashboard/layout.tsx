import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const isTeacher = session.user.role === "TEACHER"

  const navLinks = isTeacher
    ? [
        { href: "/dashboard", label: "🏠 Inicio" },
        { href: "/dashboard/mis-clases", label: "📅 Mis Clases" },
        { href: "/dashboard/disponibilidad", label: "🕐 Disponibilidad" },
        { href: "/dashboard/ingresos", label: "💰 Ingresos" },
      ]
    : [
        { href: "/dashboard", label: "🏠 Inicio" },
        { href: "/dashboard/cursos", label: "📚 Cursos" },
        { href: "/dashboard/clases", label: "🎥 Clases en Vivo" },
        { href: "/dashboard/perfil", label: "👤 Mi Perfil" },
      ]

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-60 border-r border-slate-200 bg-white flex flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Appuntes
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${isTeacher ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
            {isTeacher ? "👩‍🏫 Docente" : "👨‍🎓 Alumno"}
          </span>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-slate-900 truncate">{session.user.name}</p>
            <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="ml-60 p-8">{children}</main>
    </div>
  )
}
