'use client'
import { useState } from 'react'

export default function Competitor() {
  const [startup, setStartup] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [advantage, setAdvantage] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup || !competitors) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, competitors, advantage })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.replace('data: ', '')
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content || ''
            full += token
            setResult(prev => prev + token)
          } catch {}
        }
      }
    } catch { setResult('Erreur') }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">🔮 Competitor Killer</h1>
          <p className="text-gray-400 mt-2">Analyse tes concurrents et génère ta stratégie pour les battre</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Ta startup</label>
            <textarea value={startup} onChange={e => setStartup(e.target.value)}
              placeholder="Décris ta startup — Ex: SaaS de facturation pour freelances avec IA..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Tes concurrents</label>
            <textarea value={competitors} onChange={e => setCompetitors(e.target.value)}
              placeholder="Liste tes concurrents — Ex: Stripe, PayPal, Square, Mollie..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Ton avantage compétitif</label>
            <textarea value={advantage} onChange={e => setAdvantage(e.target.value)}
              placeholder="Qu'est-ce qui te différencie — Ex: prix 3x moins cher, IA intégrée, interface plus simple..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          </div>
          <button onClick={generate} disabled={loading || !startup || !competitors}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {loading ? '🔮 Analyse en cours...' : '🔮 Analyser et battre mes concurrents'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-red-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-red-400">🔮 Stratégie compétitive</span>
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">
                📋 Copier
              </button>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
