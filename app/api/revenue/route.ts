import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, model, market, team, budget } = await req.json()

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
          content: `Tu es un expert en modélisation financière de startups avec accès à des données de 10,000+ startups. Tu génères des prédictions de revenus réalistes basées sur des benchmarks du secteur. Sois précis avec des chiffres concrets. Réponds en français.`
        },
        {
          role: 'user',
          content: `Startup: ${startup}
Modèle business: ${model}
Marché cible: ${market}
Taille équipe: ${team}
Budget marketing mensuel: ${budget}

Génère une prédiction financière complète:
1. Revenus mensuels M1 à M12 (tableau)
2. Revenus Year 1, Year 2, Year 3
3. Break-even point
4. CAC (Coût d'Acquisition Client) estimé
5. LTV (Lifetime Value) estimée
6. Nombre de clients nécessaires pour être rentable
7. Métriques clés à surveiller
8. Scénario pessimiste / réaliste / optimiste`
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
