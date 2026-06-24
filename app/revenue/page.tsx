'use client'
import { useState } from 'react'

const models = [
  { id: 'saas', icon: '💻', name: 'SaaS', desc: 'Abonnement mensuel/annuel' },
  { id: 'marketplace', icon: '🛒', name: 'Marketplace', desc: 'Commission sur transactions' },
  { id: 'freemium', icon: '🎁', name: 'Freemium', desc: 'Gratuit + premium payant' },
  { id: 'agency', icon: '🏢', name: 'Agency/Service', desc: 'Facturation à la prestation' },
  { id: 'ecommerce', icon: '📦', name: 'E-commerce', desc: 'Vente de produits' },
  { id: 'ads', icon: '📣', name: 'Publicité', desc: 'Revenus publicitaires' },
]

const teams = ['Solo founder', '2 personnes', '3-5 personnes', '5-10 personnes', '+10 personnes']
const budgets = ['$0 - $500/mois', '$500 - $2,000/mois', '$2,000 - $10,000/mois', '$10,000+/mois']

export default function Revenue() {
  const [startup, setStartup] = useState('')
  const [model, setModel] = useState('')
  const [market, setMarket] = useState('')
  const [team, setTeam] = useState('')
  const [budget, setBudget] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup || !model || !market) return
    setLoading(true)
    setResult('')
    let full = ''
    try {
      const res = await fetch('/api/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, model, market, team, budget })
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
          <h1 className="text-3xl md:text-4xl font-bold">💰 Revenue Predictor</h1>
          <p className="text-gray-400 mt-2">Prédiction financière basée sur 10,000+ startups</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Modèle business</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {models.map(m => (
              <button key={m.id} onClick={() => setModel(m.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center ${model === m.name ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs font-semibold">{m.name}</span>
                <span className="text-xs opacity-60">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Taille équipe</h2>
            <div className="space-y-2">
              {teams.map(t => (
                <button key={t} onClick={() => setTeam(t)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${team === t ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Budget marketing</h2>
            <div className="space-y-2">
              {budgets.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${budget === b ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <input value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Décris ta startup..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <input value={market} onChange={e => setMarket(e.target.value)}
            placeholder="Marché cible — Ex: PME européennes..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || !startup || !model || !market}
            className="w-full bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all">
            {loading ? '💰 Calcul en cours...' : '💰 Prédire mes revenus'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-green-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-400">💰 Prédiction financière</span>
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
