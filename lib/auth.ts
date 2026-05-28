import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Demo credentials (sin BD)
const DEMO_USERS = [
  { id: "u1", email: "alumno@demo.cl", password: "123456", name: "Felipe Estudiante", role: "STUDENT" as const },
  { id: "u2", email: "profesor@demo.cl", password: "123456", name: "Carlos Muñoz", role: "TEACHER" as const },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const user = DEMO_USERS.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        )
        if (!user) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as "STUDENT" | "TEACHER" | "ADMIN"
      }
      return session
    },
  },
})
