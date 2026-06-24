import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('nexoro_token')?.value
    if (!token) return NextResponse.json({ user: null })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nexoro_secret')
    const { payload } = await jwtVerify(token, secret)

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT id, email, plan FROM users WHERE id = ${payload.userId as number}`

    if (result.length === 0) return NextResponse.json({ user: null })
    return NextResponse.json({ user: result[0] })
  } catch {
    return NextResponse.json({ user: null })
  }
}
