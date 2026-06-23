import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, stage, timeframe } = await req.json()

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
          content: `Tu es un expert en product management et stratégie startup. Tu génères des roadmaps produit détaillées et réalistes. Stade: ${stage}. Horizon: ${timeframe}. Structure ta réponse en phases claires avec des objectifs SMART, des métriques et des priorités. Réponds en français.`
        },
        {
          role: 'user',
          content: `Startup: ${startup}\nGénère une roadmap produit complète avec:\n1. Vision produit\n2. Phases de développement (Q1, Q2, Q3, Q4)\n3. Features prioritaires par phase\n4. KPIs et métriques de succès\n5. Ressources nécessaires\n6. Risques et mitigation`
        }
      ],
      max_tokens: 2000,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
