import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  // Demo mode — simula registro exitoso
  return NextResponse.json(
    { message: "Demo mode: cuenta creada (sin persistencia)", userId: "demo-" + Date.now() },
    { status: 201 }
  )
}
