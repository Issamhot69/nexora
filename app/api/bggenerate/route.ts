import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { description } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 3000,
      temperature: 0.8,
      messages: [{
        role: 'system',
        content: `Tu es un expert en CSS et animations web. Tu génères du CSS pur ultra créatif pour des fonds de sites web. Tu utilises: gradients animés, keyframes, pseudo-éléments, SVG inline, particles CSS, effets de lumière, glassmorphism, etc. Tu retournes UNIQUEMENT du CSS valide dans une balise <style>, rien d'autre.`
      }, {
        role: 'user',
        content: `Génère un fond CSS animé magnifique pour: "${description}"

RÈGLES STRICTES:
1. Retourne UNIQUEMENT le CSS dans une balise <style>
2. Le fond doit être appliqué au body
3. Utilise des animations CSS (@keyframes) 
4. Sois très créatif — effets de particules, gradients animés, ondulations, étoiles, etc.
5. Le fond doit correspondre EXACTEMENT à la description
6. Ajoute des pseudo-éléments ::before et ::after pour plus d'effets
7. Minimum 3 animations différentes
8. Commence par <style> et termine par </style>

Exemples de descriptions et effets:
- "océan" → vagues bleues animées, bulles, effet aquatique
- "espace" → étoiles scintillantes, nébuleuses colorées, planètes
- "feu" → flammes orangées animées, étincelles
- "forêt" → vert profond, particules de lumière, feuilles tombantes
- "cyber" → grille néon, glitch effect, lignes de code`
      }]
    })
  })

  const data = await response.json()
  const css = data.choices?.[0]?.message?.content || ''
  
  return NextResponse.json({ css })
}
