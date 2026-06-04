import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, module } = await req.json()

  const systemPrompts: Record<string, string> = {
    idea: 'Tu es un expert en création de startups. Génère une idée de startup détaillée avec concept, problème, solution, marché cible, revenus et avantage compétitif.',
    brand: 'Tu es un expert en branding. Génère un brand kit complet avec nom, slogan, couleurs, typographie et ton de voix.',
    market: 'Tu es un analyste de marché. Génère une analyse de marché complète avec taille, croissance, concurrents et opportunités.',
    ui: 'Tu es un expert UI/UX. Génère une description complète des pages et composants UI pour cette startup.',
    business: 'Tu es un expert en business model. Génère un modèle économique complet avec plans, pricing, CAC, LTV et projections.',
    marketing: 'Tu es un expert marketing. Génère une stratégie marketing complète avec canaux, messages et KPIs.',
    pitch: 'Tu es un expert en pitch deck. Génère un pitch deck complet slide par slide pour des investisseurs.',
    logo: 'Tu es un designer expert. Génère des concepts de logo détaillés avec directions créatives.',
  }

  try {
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
          { role: 'user', content: prompt || 'Génère un exemple complet' }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || 'Erreur de génération'
    return NextResponse.json({ result, ai: 'Groq LLaMA 3.3' })
  } catch (e) {
    return NextResponse.json({ result: 'Erreur de connexion', ai: 'Groq' })
  }
}
