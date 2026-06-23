'use client'
import { useState } from 'react'

export default function Export() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [module, setModule] = useState('pitch')

  const modules = [
    { id: 'pitch', label: '🚀 Pitch Deck' },
    { id: 'business', label: '💼 Business Model' },
    { id: 'market', label: '📊 Market Analysis' },
  ]

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, module })
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
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nexoro — ${modules.find(m => m.id === module)?.label}</title>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; max-width: 800px; margin: 40px auto; padding: 40px; color: #1a1a1a; line-height: 1.8; }
          h1 { color: #4F46E5; border-bottom: 3px solid #4F46E5; padding-bottom: 12px; font-size: 28px; }
          h2 { color: #374151; margin-top: 24px; font-size: 20px; }
          strong { color: #111827; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
          .logo { font-size: 24px; font-weight: 800; color: #4F46E5; }
          .date { color: #6B7280; font-size: 14px; }
          .content { white-space: pre-wrap; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">⚡ Nexoro</div>
          <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
        </div>
        <h1>${modules.find(m => m.id === module)?.label}</h1>
        <p><strong>Startup :</strong> ${prompt}</p>
        <hr style="margin: 24px 0; border-color: #E5E7EB;">
        <div class="content">${result.replace(/\*\*/g, '').replace(/\*/g, '')}</div>
        <div class="footer">Généré par Nexoro AI Startup Factory — nexoro.app</div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">📄 Export PDF</h1>
          <p className="text-gray-500 mt-1">Génère et exporte en PDF professionnel</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setModule(m.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${module === m.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {m.label}
              </button>
            ))}
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération...' : '⚡ Générer'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-400">✓ Résultat généré</span>
              <button onClick={exportPDF}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-xl transition-all text-sm">
                📥 Exporter PDF
              </button>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
