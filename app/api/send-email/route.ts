import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { type, email, name } = await req.json()

    const templates: Record<string, { subject: string; html: string }> = {
      welcome: {
        subject: '🎉 Bienvenue sur Nexoro — Ta startup factory IA',
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#ffffff;border-radius:20px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center">
            <h1 style="font-size:2.5rem;font-weight:900;margin:0">⚡ Nexoro</h1>
            <p style="opacity:0.9;margin:8px 0 0">AI Startup Factory</p>
          </div>
          <div style="padding:40px">
            <h2 style="color:#6366f1">Bienvenue ${name || ''} ! 🎉</h2>
            <p style="color:#9ca3af;line-height:1.8">Tu viens de rejoindre la première AI Startup Factory au monde. En quelques minutes, tu peux générer une startup complète — idée, site web, code source, pitch deck et bien plus.</p>
            <div style="margin:30px 0">
              <h3 style="color:#ffffff">Ce que tu peux faire maintenant :</h3>
              <ul style="color:#9ca3af;line-height:2">
                <li>🧬 Découvrir ton Startup DNA</li>
                <li>🚀 Lancer une startup en 5 minutes</li>
                <li>💻 Générer du code source complet</li>
                <li>🌐 Créer un site web professionnel</li>
                <li>💰 Prédire tes revenus sur 3 ans</li>
              </ul>
            </div>
            <div style="text-align:center;margin:30px 0">
              <a href="https://nexora-puce-eight.vercel.app" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:1.1rem">
                ⚡ Commencer maintenant →
              </a>
            </div>
          </div>
          <div style="background:#1a1a2e;padding:20px;text-align:center;color:#6b7280;font-size:0.85rem">
            <p>© 2024 Nexoro AI — nexora-puce-eight.vercel.app</p>
          </div>
        </div>`
      },
      confirm: {
        subject: '✅ Confirme ton email Nexoro',
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#ffffff;border-radius:20px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center">
            <h1 style="font-size:2.5rem;font-weight:900;margin:0">⚡ Nexoro</h1>
          </div>
          <div style="padding:40px;text-align:center">
            <h2>Confirme ton adresse email</h2>
            <p style="color:#9ca3af">Clique sur le bouton ci-dessous pour activer ton compte Nexoro.</p>
            <div style="margin:30px 0">
              <a href="https://nexora-puce-eight.vercel.app/auth" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:700">
                ✅ Confirmer mon email
              </a>
            </div>
          </div>
        </div>`
      }
    }

    const template = templates[type] || templates.welcome

    const { data, error } = await resend.emails.send({
      from: 'Nexoro <onboarding@resend.dev>',
      to: [email],
      subject: template.subject,
      html: template.html,
    })

    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
  }
}
