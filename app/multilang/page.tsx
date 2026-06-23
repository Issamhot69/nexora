'use client'
import { useState } from 'react'

const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', rtl: true },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
]

const modules = [
  { id: 'idea', label: '💡 Idea Generator' },
  { id: 'brand', label: '🎨 Brand Kit' },
  { id: 'market', label: '📊 Market Analyzer' },
  { id: 'business', label: '💼 Business Model' },
  { id: 'marketing', label: '📣 Marketing' },
  { id: 'pitch', label: '🚀 Pitch Deck' },
]

export default function MultiLang() {
  const [selectedLang, setSelectedLang] = useState('fr')
  const [selectedModule, setSelectedModule] = useState('idea')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')
    let full = ''
    const lang = languages.find(l => l.code === selectedLang)

    try {
      const res = await fetch('/api/multilang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, module: selectedModule, lang: selectedLang, langName: lang?.name })
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

  const isRTL = languages.find(l => l.code === selectedLang)?.rtl

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🌍 Multi-langues</h1>
          <p className="text-gray-500 mt-1">Génère ta startup dans n'importe quelle langue</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Choisis la langue</h2>
          <div className="grid grid-cols-4 gap-3">
            {languages.map(lang => (
              <button key={lang.code} onClick={() => setSelectedLang(lang.code)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedLang === lang.code ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-xs font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Module</h2>
          <div className="grid grid-cols-3 gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setSelectedModule(m.id)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${selectedModule === m.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération...' : `⚡ Générer en ${languages.find(l => l.code === selectedLang)?.name}`}
          </button>
        </div>

        {result && (
          <div className={`bg-gray-900 border border-indigo-800 rounded-2xl p-6`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2 mb-4">
              <span>{languages.find(l => l.code === selectedLang)?.flag}</span>
              <span className="text-sm font-medium text-indigo-400">
                Résultat en {languages.find(l => l.code === selectedLang)?.name}
              </span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
