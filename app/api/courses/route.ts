import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")
  const level = searchParams.get("level")

  const courses = await db.course.findMany({
    where: {
      published: true,
      ...(subject && { subject }),
      ...(level && { level }),
    },
    include: {
      videos: { orderBy: { order: "asc" }, select: { id: true, title: true, duration: true, order: true } },
    },
    orderBy: { title: "asc" },
  })

  return NextResponse.json(courses)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const course = await db.course.create({ data: body })
  return NextResponse.json(course, { status: 201 })
}
