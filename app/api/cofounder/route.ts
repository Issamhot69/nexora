import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

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
          content: `Tu es un AI Co-Founder expérimenté et bienveillant. Tu as lancé plusieurs startups réussies à l'international. Tu aides les entrepreneurs à challenger leurs idées, identifier les risques, trouver leur marché cible et planifier les prochaines étapes. Tu es direct, honnête et encourageant. Réponds en français.`
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.8,
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
