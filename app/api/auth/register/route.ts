import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, plan',
      [email, hashedPassword]
    )

    const user = result.rows[0]
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'nexoro_secret', { expiresIn: '7d' })

    return NextResponse.json({ token, user })
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
