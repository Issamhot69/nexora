import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })

    const sql = neon(process.env.DATABASE_URL!)
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})
      RETURNING id, email, plan
    `
    const user = result[0]
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'nexoro_secret', { expiresIn: '7d' })

    return NextResponse.json({ token, user })
  } catch (error: any) {
    if (error.code === '23505') return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
