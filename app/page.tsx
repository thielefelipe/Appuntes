import Link from "next/link"
import { SUBJECTS, SUBSCRIPTION_PLANS, formatPrice } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Appuntes
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Aprende con los mejores profesores,{" "}
            <span className="text-blue-200">desde donde estés</span>
          </h1>
          <p className="mb-10 text-xl text-blue-100">
            Ayudantías especializadas en Matemática, Lenguaje, Ciencias e Inglés para PAES, 1° a 4° Medio y universitarios.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg hover:bg-blue-50"
            >
              Comenzar ahora
            </Link>
            <Link
              href="#precios"
              className="rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10"
            >
              Ver planes
            </Link>
          </div>
        </div>
      </section>

      {/* Materias */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Materias disponibles
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { subject: "Matemática", emoji: "📐", color: "bg-blue-100 text-blue-700" },
              { subject: "Lenguaje", emoji: "📚", color: "bg-green-100 text-green-700" },
              { subject: "Ciencias", emoji: "🔬", color: "bg-purple-100 text-purple-700" },
              { subject: "Inglés", emoji: "🌎", color: "bg-orange-100 text-orange-700" },
            ].map(({ subject, emoji, color }) => (
              <div
                key={subject}
                className={`rounded-2xl p-8 text-center ${color} shadow-sm`}
              >
                <div className="mb-3 text-5xl">{emoji}</div>
                <h3 className="text-xl font-bold">{subject}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Regístrate", desc: "Crea tu cuenta en minutos y elige tu nivel." },
              { step: "2", title: "Accede al contenido", desc: "Con tu membresía, accede a todos los videos y guías." },
              { step: "3", title: "Reserva clases en vivo", desc: "Elige un docente y reserva una sesión personalizada." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">
            Planes de suscripción
          </h2>
          <p className="mb-12 text-center text-slate-600">
            Acceso ilimitado al contenido. Las clases en vivo se pagan aparte.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl p-8 ${key === "QUARTERLY" ? "bg-blue-600 text-white shadow-xl ring-4 ring-blue-300" : "bg-white text-slate-900 shadow-md"}`}
              >
                <h3 className="mb-2 text-xl font-bold">{plan.label}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  <span className={`text-sm ${key === "QUARTERLY" ? "text-blue-200" : "text-slate-500"}`}>
                    /{plan.months === 1 ? "mes" : `${plan.months} meses`}
                  </span>
                </div>
                {key === "QUARTERLY" && (
                  <div className="mb-4 rounded-lg bg-blue-500 px-3 py-1 text-center text-sm font-medium">
                    ¡Más popular!
                  </div>
                )}
                <ul className={`mb-8 space-y-2 text-sm ${key === "QUARTERLY" ? "text-blue-100" : "text-slate-600"}`}>
                  <li>✓ Acceso a todos los cursos</li>
                  <li>✓ Videos y guías ilimitadas</li>
                  <li>✓ Simulacros PAES</li>
                  <li>✓ Clases en vivo (precio adicional)</li>
                </ul>
                <Link
                  href="/register"
                  className={`block w-full rounded-xl py-3 text-center font-semibold ${
                    key === "QUARTERLY"
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Empezar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Appuntes. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
