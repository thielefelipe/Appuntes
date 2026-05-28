import { NextResponse } from "next/server"
import { mockClasses } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")

  const classes = mockClasses.filter((c) => !subject || c.subject === subject)

  return NextResponse.json(classes)
}

export async function POST() {
  return NextResponse.json({ message: "Demo mode — no se guardan datos" }, { status: 200 })
}
