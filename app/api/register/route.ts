import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TEACHER"]),
  gradeLevel: z.string().optional(),
  subject: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role, gradeLevel, subject } = registerSchema.parse(body)

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === "STUDENT" && {
          studentProfile: {
            create: { gradeLevel: gradeLevel || "PAES" },
          },
        }),
        ...(role === "TEACHER" && {
          teacherProfile: {
            create: {
              subject: subject || "Matemática",
              hourlyRate: 15000,
            },
          },
        }),
      },
    })

    return NextResponse.json({ message: "Usuario creado", userId: user.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
