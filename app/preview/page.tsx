'use client'
import { useState } from 'react'

export default function Preview() {
  const [prompt, setPrompt] = useState('')
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'code' | 'preview'>('preview')

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setHtml('')
    let fullHtml = ''

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, module: 'ui' })
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
            fullHtml += token
            setHtml(prev => prev + token)
          } catch {}
        }
      }
    } catch {
      setHtml('<h1>Erreur de génération</h1>')
    }
    setLoading(false)
  }

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-nexoro.html'
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🖥️ UI Builder</h1>
            <p className="text-gray-500 mt-1">Génère un vrai site HTML complet</p>
          </div>
          {html && (
            <button onClick={download} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-xl transition-all">
              📥 Télécharger HTML
            </button>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ex: A modern SaaS landing page for an AI productivity tool with hero, features, pricing and CTA sections..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={generate}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? '⏳ Génération du site...' : '⚡ Générer le site'}
          </button>
        </div>

        {html && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <button
                onClick={() => setView('preview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                👁️ Preview
              </button>
              <button
                onClick={() => setView('code')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                💻 Code HTML
              </button>
              <span className="ml-auto text-xs text-green-400">✓ Site généré</span>
            </div>

            {view === 'preview' ? (
              <iframe
                srcDoc={html}
                className="w-full h-[600px] bg-white"
                sandbox="allow-scripts"
                title="Preview"
              />
            ) : (
              <pre className="p-6 text-green-400 text-xs overflow-auto h-[600px] font-mono">
                {html}
              </pre>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
