'use client'
import { useState, useRef, useEffect } from 'react'

const quickQuestions = [
  '🌐 Comment créer mon site web ?',
  '🎨 Comment générer des images pour mon site ?',
  '✨ Comment obtenir un logo professionnel ?',
  '🚀 Comment publier mon site en ligne ?',
  '🌍 Comment acheter un domaine ?',
  '📸 Comment ajouter mes photos au site ?',
  '🔍 Comment améliorer mon SEO ?',
  '💰 Quels sont les prix de Nexoro ?',
]

const systemPrompt = `Tu es Alex, le consultant IA de Nexoro — la plateforme de création de sites web par IA.
Tu aides les utilisateurs à créer leur site web professionnel étape par étape.

Nexoro permet de :
1. Créer un site web complet en 10 minutes sur /create
2. Générer des images IA pour le site sur /imagegen  
3. Créer un logo IA sur /logo
4. Publier le site en ligne avec un clic
5. Acheter un domaine personnalisé

Réponds toujours en français, sois amical, concis et pratique.
Guide toujours vers l'action — donne des étapes claires.
Si quelqu'un décrit son business, propose-lui immédiatement comment créer son site.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Consultant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis Alex, ton consultant IA Nexoro. Je suis ici pour t aide a creer ton site web professionnel. Que puis-je faire pour toi ?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Erreur' }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur: ' + e }])
    }
    setLoading(false)
  }

  const formatMsg = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h1 className="font-bold">Alex — Consultant IA Nexoro</h1>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">En ligne — Répond instantanément</span>
          </div>
        </div>
      </div>

      {/* Questions rapides */}
      <div className="p-3 border-b border-gray-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {quickQuestions.map(q => (
            <button key={q} onClick={() => send(q)}
              className="bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">🤖</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-gray-800 text-gray-100 rounded-tl-none'
            }`}
              dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
            />
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm">🤖</div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Pose ta question à Alex..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all">
            Envoyer
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">Alex est spécialisé dans la création de sites web avec Nexoro</p>
      </div>
    </main>
  )
}
