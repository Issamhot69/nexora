'use client'
import { useState } from 'react'

export default function SEO() {
  const [startup, setStartup] = useState('')
  const [website, setWebsite] = useState('')
  const [keywords, setKeywords] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup || !keywords) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, website, keywords })
      })
      const data = await res.json()
      setResult(data.result)
    } catch {}
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🔍 SEO Analyzer</h1>
          <p className="text-gray-500 mt-1">Stratégie SEO complète générée par IA</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <input value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Nom de ta startup — Ex: FastFoodGenie"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <input value={website} onChange={e => setWebsite(e.target.value)}
            placeholder="URL du site (optionnel) — Ex: www.fastfoodgenie.com"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <textarea value={keywords} onChange={e => setKeywords(e.target.value)}
            placeholder="Mots-clés cibles — Ex: commande fast food en ligne, livraison restaurant, gestion commandes restaurant IA..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || !startup || !keywords}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
            {loading ? '🔍 Analyse SEO...' : '🔍 Analyser et optimiser le SEO'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-orange-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-orange-400">🔍 Stratégie SEO complète</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">📋 Copier</button>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
