import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

const systemPrompts: Record<string, string> = {
  idea: 'Tu es un expert en création de startups internationales. Génère une idée de startup détaillée avec concept, problème, solution, marché cible, revenus et avantage compétitif. Réponds en français.',
  brand: 'Tu es un expert en branding international. Génère un brand kit complet avec nom, slogan, couleurs, typographie et ton de voix. Réponds en français.',
  market: 'Tu es un analyste de marché mondial. Génère une analyse complète avec taille, croissance, concurrents et opportunités. Réponds en français.',
  ui: `Tu es un expert développeur web. Génère un site web HTML5 complet en UNE SEULE page. RÈGLES ABSOLUES: 1) Commence EXACTEMENT par <!DOCTYPE html> 2) Inclus TOUT le CSS dans une balise <style> dans le <head> 3) Inclus tout le JavaScript dans <script> avant </body> 4) Ne génère AUCUN texte avant <!DOCTYPE html> ou après </html> 5) Site complet avec: nav, hero, features, pricing, testimonials, footer 6) Design moderne avec couleurs adaptées à la startup 7) 100% responsive. COMMENCE DIRECTEMENT PAR <!DOCTYPE html> SANS AUCUN TEXTE AVANT.`,
  business: 'Tu es un expert en business model. Génère un modèle économique complet avec plans, pricing, CAC, LTV et projections. Réponds en français.',
  marketing: 'Tu es un expert marketing digital. Génère une stratégie complète avec canaux, messages clés et KPIs. Réponds en français.',
  pitch: 'Tu es un expert en pitch deck. Génère un pitch deck complet slide par slide pour des investisseurs internationaux. Réponds en français.',
  logo: 'Tu es un designer expert. Génère des concepts de logo détaillés avec directions créatives et couleurs. Réponds en français.',
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous'
  const { success, remaining } = rateLimit(ip, 20, 60000)
  
  if (!success) {
    return new Response(JSON.stringify({ error: 'Trop de requêtes — attendez 1 minute' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
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
      max_tokens: 4000,
      temperature: 0.7,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-RateLimit-Remaining': remaining.toString()
    }
  })
}
