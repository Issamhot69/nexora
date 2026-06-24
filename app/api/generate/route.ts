import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'
import { checkGenerationLimit, incrementGenerations } from '@/lib/plans'

const systemPrompts: Record<string, string> = {
  idea: 'Tu es un expert en création de startups internationales. Génère une idée de startup détaillée avec concept, problème, solution, marché cible, revenus et avantage compétitif. Réponds en français.',
  brand: 'Tu es un expert en branding international. Génère un brand kit complet avec nom, slogan, couleurs, typographie et ton de voix. Réponds en français.',
  market: 'Tu es un analyste de marché mondial. Génère une analyse complète avec taille, croissance, concurrents et opportunités. Réponds en français.',
  ui: 'Tu es un expert UI/UX. Génère du vrai code HTML/CSS/JS complet pour une landing page moderne et professionnelle. Commence par <!DOCTYPE html>.',
  business: 'Tu es un expert en business model. Génère un modèle économique complet avec plans, pricing, CAC, LTV et projections. Réponds en français.',
  marketing: 'Tu es un expert marketing digital. Génère une stratégie complète avec canaux, messages clés et KPIs. Réponds en français.',
  pitch: 'Tu es un expert en pitch deck. Génère un pitch deck complet slide par slide pour des investisseurs internationaux. Réponds en français.',
  logo: 'Tu es un designer expert. Génère des concepts de logo détaillés avec directions créatives et couleurs. Réponds en français.',
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = rateLimit(ip, 20, 60000)
  if (!success) {
    return new Response(JSON.stringify({ error: 'Trop de requêtes — attendez 1 minute' }), {
      status: 429, headers: { 'Content-Type': 'application/json' }
    })
  }

  // Check plan limits
  const token = req.cookies.get('nexoro_token')?.value
  const { allowed, remaining, plan, userId } = await checkGenerationLimit(token)

  if (!allowed) {
    return new Response(JSON.stringify({
      error: `Limite atteinte — Plan ${plan} : 3 générations/mois. Upgradez vers Pro pour un accès illimité !`,
      upgrade: true,
      remaining: 0
    }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  const { prompt, module } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompts[module] || systemPrompts.idea },
        { role: 'user', content: prompt || 'Génère un exemple complet et détaillé' }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true
    })
  })

  // Incrémenter le compteur si user connecté
  if (userId) await incrementGenerations(userId).catch(() => {})

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-RateLimit-Remaining': remaining.toString(),
      'X-Plan': plan
    }
  })
}
