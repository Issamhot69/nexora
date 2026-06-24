import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    if (result.length === 0) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const user = result[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nexoro_secret')
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, plan: user.plan } })
    response.cookies.set('nexoro_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
