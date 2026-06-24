'use client'
import { useState } from 'react'

const tlds = [
  { ext: '.com', price: '$12/an', popular: true },
  { ext: '.io', price: '$39/an', popular: true },
  { ext: '.ai', price: '$89/an', popular: true },
  { ext: '.app', price: '$19/an', popular: false },
  { ext: '.co', price: '$29/an', popular: false },
  { ext: '.net', price: '$14/an', popular: false },
  { ext: '.org', price: '$13/an', popular: false },
  { ext: '.dev', price: '$15/an', popular: false },
]

const registrars = [
  { name: 'Cloudflare', logo: '🟠', url: 'https://cloudflare.com', desc: 'Meilleur prix, pas de markup', recommended: true },
  { name: 'Namecheap', logo: '🟢', url: 'https://namecheap.com', desc: 'Simple et rapide', recommended: false },
  { name: 'GoDaddy', logo: '🔵', url: 'https://godaddy.com', desc: 'Le plus connu', recommended: false },
]

const steps = [
  { num: '1', title: 'Choisir le domaine', desc: 'Cherche et vérifie la disponibilité' },
  { num: '2', title: 'Acheter le domaine', desc: 'Via Cloudflare, Namecheap ou GoDaddy' },
  { num: '3', title: 'Configurer DNS', desc: 'Pointe vers Vercel en 2 minutes' },
  { num: '4', title: 'Site en ligne', desc: 'Ton domaine est actif avec SSL gratuit' },
]

export default function Domains() {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTlds, setSelectedTlds] = useState(['.com', '.io', '.ai'])

  const generateSuggestions = async () => {
    if (!search.trim()) return
    setLoading(true)
    
    // Génère des suggestions via Groq
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Génère 8 noms de domaine courts, mémorables et disponibles pour: "${search}". Retourne UNIQUEMENT les noms sans extension, séparés par des virgules. Ex: fastbite,quickmeal,foodgenie`,
          module: 'brand'
        })
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''
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
            result += json.choices?.[0]?.delta?.content || ''
          } catch {}
        }
      }
      // Parse les suggestions
      const names = result.match(/[a-zA-Z0-9-]+/g)?.slice(0, 8) || []
      setSuggestions(names)
    } catch {}
    setLoading(false)
  }

  const checkDomain = (name: string, tld: string) => {
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${name}${tld}`, '_blank')
  }

  const buyDomain = (registrar: typeof registrars[0], name: string) => {
    window.open(`${registrar.url}/domains/registration/results/?domain=${name}.com`, '_blank')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🌐 Domain Manager</h1>
          <p className="text-gray-500 mt-1">Trouve et achète le domaine parfait pour ta startup</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map(s => (
            <div key={s.num} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-sm">{s.num}</div>
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">🔍 Chercher un domaine</h2>
          <div className="flex gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateSuggestions()}
              placeholder="Ex: fastfoodgenie, nexoro, myapp..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            <button onClick={generateSuggestions} disabled={loading || !search}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all">
              {loading ? '⏳' : '✨ IA'}
            </button>
          </div>

          {/* TLD selector */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Extensions</p>
            <div className="flex flex-wrap gap-2">
              {tlds.map(t => (
                <button key={t.ext}
                  onClick={() => setSelectedTlds(prev => prev.includes(t.ext) ? prev.filter(x => x !== t.ext) : [...prev, t.ext])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedTlds.includes(t.ext) ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {t.ext} <span className="opacity-60">{t.price}</span>
                  {t.popular && <span className="ml-1 text-yellow-400">⭐</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats domaines */}
          {(search || suggestions.length > 0) && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Domaines disponibles</p>
              {(suggestions.length > 0 ? suggestions : [search]).map(name => (
                <div key={name} className="space-y-1">
                  {selectedTlds.map(tld => (
                    <div key={tld} className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-mono text-sm">{name}{tld}</span>
                        <span className="text-xs text-gray-500">{tlds.find(t => t.ext === tld)?.price}</span>
                      </div>
                      <button onClick={() => checkDomain(name, tld)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 px-4 rounded-lg transition-all">
                        Acheter →
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registrars */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">🏪 Où acheter ton domaine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {registrars.map(r => (
              <div key={r.name} className={`border rounded-2xl p-4 ${r.recommended ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-800 bg-gray-800'}`}>
                {r.recommended && <div className="text-xs text-indigo-400 font-semibold mb-2">⭐ Recommandé</div>}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{r.logo}</span>
                  <span className="font-bold">{r.name}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{r.desc}</p>
                <button onClick={() => window.open(r.url, '_blank')}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${r.recommended ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                  Visiter {r.name} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DNS Config */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">⚙️ Configurer DNS sur Vercel</h2>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Après avoir acheté ton domaine, ajoute ces records DNS chez ton registrar :</p>
            <div className="bg-gray-800 rounded-xl p-4 font-mono text-sm space-y-2">
              <div className="flex gap-4">
                <span className="text-indigo-400 w-16">Type</span>
                <span className="text-green-400 w-24">Name</span>
                <span className="text-yellow-400">Value</span>
              </div>
              <div className="flex gap-4 text-gray-300">
                <span className="w-16">A</span>
                <span className="w-24">@</span>
                <span>76.76.21.21</span>
              </div>
              <div className="flex gap-4 text-gray-300">
                <span className="w-16">CNAME</span>
                <span className="w-24">www</span>
                <span>cname.vercel-dns.com</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs">SSL gratuit activé automatiquement par Vercel ✅</p>
          </div>
        </div>
      </div>
    </main>
  )
}
