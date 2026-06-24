import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })

    const sql = neon(process.env.DATABASE_URL!)
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})
      RETURNING id, email, plan
    `
    const user = result[0]

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nexoro_secret')
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Envoyer email de bienvenue
    await resend.emails.send({
      from: 'Nexoro <onboarding@resend.dev>',
      to: [email],
      subject: '🎉 Bienvenue sur Nexoro — Ta startup factory IA',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;border-radius:20px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center">
          <h1 style="font-size:2rem;margin:0">⚡ Nexoro</h1>
          <p style="opacity:0.9;margin:8px 0 0">AI Startup Factory</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#6366f1">Bienvenue ${name || email} ! 🎉</h2>
          <p style="color:#9ca3af;line-height:1.8">Tu viens de rejoindre la première AI Startup Factory. Génère ta startup complète en 5 minutes !</p>
          <div style="text-align:center;margin:30px 0">
            <a href="https://nexora-puce-eight.vercel.app" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:700">
              ⚡ Commencer maintenant →
            </a>
          </div>
        </div>
        <div style="background:#1a1a2e;padding:20px;text-align:center;color:#6b7280;font-size:0.85rem">
          © 2024 Nexoro AI
        </div>
      </div>`
    }).catch(() => {}) // Ne pas bloquer si email échoue

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, plan: user.plan } })
    response.cookies.set('nexoro_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error: any) {
    if (error.code === '23505') return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
