import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, module, lang, langName } = await req.json()

  const systemPrompts: Record<string, string> = {
    idea: 'Tu es un expert en création de startups internationales. Génère une idée de startup détaillée avec concept, problème, solution, marché cible, revenus et avantage compétitif.',
    brand: 'Tu es un expert en branding international. Génère un brand kit complet avec nom, slogan, couleurs, typographie et ton de voix.',
    market: 'Tu es un analyste de marché mondial. Génère une analyse complète avec taille, croissance, concurrents et opportunités.',
    business: 'Tu es un expert en business model. Génère un modèle économique complet avec plans, pricing, CAC, LTV et projections.',
    marketing: 'Tu es un expert marketing digital. Génère une stratégie complète avec canaux, messages clés et KPIs.',
    pitch: 'Tu es un expert en pitch deck. Génère un pitch deck complet slide par slide pour des investisseurs internationaux.',
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `${systemPrompts[module] || systemPrompts.idea} Réponds UNIQUEMENT en ${langName}. Ne mélange pas les langues.`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  })
}
