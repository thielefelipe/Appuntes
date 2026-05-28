import { NextResponse } from "next/server"
import { mockCourses } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")
  const level = searchParams.get("level")

  const courses = mockCourses.filter(
    (c) => (!subject || c.subject === subject) && (!level || c.level === level)
  )

  return NextResponse.json(courses)
}
