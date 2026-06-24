import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, competitors, advantage } = await req.json()

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
          content: `Tu es un expert en stratégie compétitive et business intelligence. Tu analyses les concurrents et génères des stratégies concrètes pour les battre. Tu es direct et opérationnel. Réponds en français.`
        },
        {
          role: 'user',
          content: `Ma startup: ${startup}
Mes concurrents: ${competitors}
Mon avantage: ${advantage}

Génère une analyse compétitive complète:
1. Faiblesses critiques de chaque concurrent
2. Opportunités que tu peux exploiter immédiatement
3. Plan d'attaque en 90 jours pour les dépasser
4. Fonctionnalités à copier et à améliorer
5. Positionnement prix optimal
6. Message marketing anti-concurrent
7. Les clients insatisfaits à cibler en premier
8. Score de menace de chaque concurrent (sur 10)`
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
