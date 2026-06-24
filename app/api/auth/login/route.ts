import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    if (result.length === 0) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const user = result[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'nexoro_secret', { expiresIn: '7d' })
    return NextResponse.json({ token, user: { id: user.id, email: user.email, plan: user.plan } })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
