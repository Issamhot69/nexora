'use client'
import { useState } from 'react'

const docTypes = [
  { id: 'cgu', icon: '📋', name: 'CGU', desc: 'Conditions Générales d\'Utilisation' },
  { id: 'privacy', icon: '🔒', name: 'RGPD', desc: 'Politique de Confidentialité' },
  { id: 'terms', icon: '⚖️', name: 'Mentions Légales', desc: 'Obligatoires pour tout site' },
  { id: 'contract', icon: '📝', name: 'Contrat', desc: 'Prestation de services' },
  { id: 'nda', icon: '🤐', name: 'NDA', desc: 'Accord de Non-Divulgation' },
  { id: 'status', icon: '🏢', name: 'Statuts', desc: 'SARL / SAS / LLC' },
]

const countries = ['France', 'Maroc', 'Belgique', 'Suisse', 'USA', 'UK', 'Canada', 'UAE']

export default function Legal() {
  const [startup, setStartup] = useState('')
  const [type, setType] = useState('cgu')
  const [country, setCountry] = useState('France')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup.trim()) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, type, country })
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
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${docTypes.find(d => d.id === type)?.name}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:40px;color:#1a1a1a;line-height:1.8}
    h1{color:#4F46E5;border-bottom:2px solid #4F46E5;padding-bottom:12px}
    .header{display:flex;justify-content:space-between;margin-bottom:32px}
    .logo{font-size:20px;font-weight:800;color:#4F46E5}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:12px;text-align:center}
    pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head>
    <body><div class="header"><div class="logo">⚡ Nexoro Legal</div><div>${new Date().toLocaleDateString('fr-FR')}</div></div>
    <h1>${docTypes.find(d => d.id === type)?.name}</h1>
    <p><strong>Startup:</strong> ${startup} | <strong>Pays:</strong> ${country}</p><hr>
    <pre>${result}</pre>
    <div class="footer">Document généré par Nexoro AI — À faire valider par un avocat</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">⚖️ Juridique IA</h1>
          <p className="text-gray-500 mt-1">Génère tous tes documents légaux en quelques secondes</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Type de document</h2>
          <div className="grid grid-cols-3 gap-3">
            {docTypes.map(d => (
              <button key={d.id} onClick={() => setType(d.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${type === d.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-xl">{d.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-xs opacity-60">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Pays</label>
            <div className="flex gap-2 flex-wrap">
              {countries.map(c => (
                <button key={c} onClick={() => setCountry(c)}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all ${country === c ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <textarea value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Décris ta startup — nom, activité, siège social..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération...' : `⚡ Générer ${docTypes.find(d => d.id === type)?.name}`}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-400">✓ Document généré</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">📋 Copier</button>
                <button onClick={exportPDF}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm py-1 px-4 rounded-xl">📥 PDF</button>
              </div>
            </div>
            <div className="text-yellow-400 text-xs mb-4 bg-yellow-900/20 border border-yellow-800 rounded-xl p-3">
              ⚠️ Ce document est généré par IA — Faites-le valider par un avocat avant utilisation
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
