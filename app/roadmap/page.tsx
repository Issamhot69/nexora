'use client'
import { useState } from 'react'

const stages = [
  { id: 'idea', icon: '💡', name: 'Idée', desc: 'Pas encore de produit' },
  { id: 'mvp', icon: '🚀', name: 'MVP', desc: 'Premiers utilisateurs' },
  { id: 'growth', icon: '📈', name: 'Growth', desc: 'Traction validée' },
  { id: 'scale', icon: '🌍', name: 'Scale', desc: 'Expansion internationale' },
]

const timeframes = ['3 mois', '6 mois', '1 an', '2 ans', '3 ans']

export default function Roadmap() {
  const [startup, setStartup] = useState('')
  const [stage, setStage] = useState('mvp')
  const [timeframe, setTimeframe] = useState('1 an')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup.trim()) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, stage, timeframe })
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

  const exportPDF = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Roadmap — ${startup}</title>
    <style>body{font-family:'Helvetica Neue',sans-serif;max-width:800px;margin:40px auto;padding:40px;color:#1a1a1a;line-height:1.8}
    h1{color:#4F46E5}pre{white-space:pre-wrap;font-family:inherit}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:12px;text-align:center}</style>
    </head><body>
    <h1>🗺️ Roadmap Produit</h1>
    <p><strong>Startup:</strong> ${startup} | <strong>Stade:</strong> ${stage} | <strong>Horizon:</strong> ${timeframe}</p><hr>
    <pre>${result}</pre>
    <div class="footer">Généré par Nexoro AI Startup Factory</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🗺️ Roadmap Produit</h1>
          <p className="text-gray-500 mt-1">Génère un plan de développement complet pour ta startup</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Stade actuel</h2>
          <div className="grid grid-cols-4 gap-3">
            {stages.map(s => (
              <button key={s.id} onClick={() => setStage(s.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${stage === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="text-xs opacity-60">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Horizon temporel</label>
            <div className="flex gap-2">
              {timeframes.map(t => (
                <button key={t} onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${timeframe === t ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <textarea value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Décris ta startup et tes objectifs..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération roadmap...' : '⚡ Générer la Roadmap'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-400">✓ Roadmap générée</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">📋 Copier</button>
                <button onClick={exportPDF}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm py-1 px-4 rounded-xl">📥 PDF</button>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
