import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const classSchema = z.object({
  subject: z.string(),
  scheduledAt: z.string(),
  duration: z.number().default(60),
  maxStudents: z.number().default(1),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")

  const classes = await db.virtualClass.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: new Date() },
      ...(subject && { subject }),
    },
    include: {
      teacher: { include: { user: { select: { name: true, avatar: true } } } },
      bookings: { select: { id: true } },
    },
    orderBy: { scheduledAt: "asc" },
  })

  return NextResponse.json(classes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Solo docentes pueden crear clases" }, { status: 401 })
  }

  const body = await req.json()
  const data = classSchema.parse(body)

  const teacher = await db.teacherProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!teacher) {
    return NextResponse.json({ error: "Perfil de docente no encontrado" }, { status: 404 })
  }

  const virtualClass = await db.virtualClass.create({
    data: {
      ...data,
      scheduledAt: new Date(data.scheduledAt),
      teacherId: teacher.id,
      hourlyRate: teacher.hourlyRate,
    },
  })

  return NextResponse.json(virtualClass, { status: 201 })
}
