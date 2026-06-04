'use client'
import { useState } from 'react'

const steps = [
  { id: 1, icon: '💡', label: 'Idée analysée' },
  { id: 2, icon: '🎨', label: 'Brand Kit créé' },
  { id: 3, icon: '🌐', label: 'Site généré' },
  { id: 4, icon: '📊', label: 'Business Model' },
  { id: 5, icon: '🚀', label: 'Pitch Deck' },
  { id: 6, icon: '✅', label: 'Startup prête !' },
]

export default function Launch() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const launch = async () => {
    if (!idea.trim()) return
    setLoading(true)
    setDone(false)
    setResults({})
    setCurrentStep(0)

    const modules = ['idea', 'brand', 'ui', 'business', 'pitch']

    for (let i = 0; i < modules.length; i++) {
      setCurrentStep(i + 1)
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: idea, module: modules[i] })
        })
        const data = await res.json()
        setResults(prev => ({ ...prev, [modules[i]]: data.result }))
        await new Promise(r => setTimeout(r, 500))
      } catch (e) {
        console.error(e)
      }
    }

    setCurrentStep(6)
    setDone(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold">🚀 Launch in 5 Minutes</h1>
          <p className="text-gray-400 mt-2">Décris ton idée — Nexoro génère toute ta startup</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Ex: A SaaS platform that helps restaurants manage their online orders using AI..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-28 focus:outline-none focus:border-indigo-500"
            disabled={loading}
          />
          <button
            onClick={launch}
            disabled={loading || !idea.trim()}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg"
          >
            {loading ? '⏳ Génération en cours...' : '⚡ Lancer ma startup maintenant'}
          </button>
        </div>

        {/* Steps */}
        {(loading || done) && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Progression</h2>
            <div className="space-y-3">
              {steps.map(step => (
                <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  currentStep >= step.id ? 'bg-indigo-900/40 border border-indigo-700' : 'opacity-30'
                }`}>
                  <span className="text-2xl">{step.icon}</span>
                  <span className="font-medium">{step.label}</span>
                  {currentStep > step.id && <span className="ml-auto text-green-400">✓</span>}
                  {currentStep === step.id && loading && (
                    <span className="ml-auto text-indigo-400 animate-pulse">En cours...</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats */}
        {done && (
          <div className="space-y-4">
            <div className="text-center bg-green-900/20 border border-green-700 rounded-2xl p-6">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-green-400">Ta startup est prête !</h2>
              <p className="text-gray-400 mt-2">Tous les modules ont été générés avec succès</p>
            </div>

            {Object.entries(results).map(([module, result]) => {
              const icons: Record<string, string> = { idea: '💡', brand: '🎨', ui: '🖥️', business: '💼', pitch: '🚀' }
              const names: Record<string, string> = { idea: 'Idée', brand: 'Brand Kit', ui: 'UI Builder', business: 'Business Model', pitch: 'Pitch Deck' }
              return (
                <div key={module} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{icons[module]}</span>
                    <span className="font-semibold">{names[module]}</span>
                  </div>
                  <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
                </div>
              )
            })}

            <button
              onClick={() => { setDone(false); setIdea(''); setCurrentStep(0); setResults({}) }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              🔄 Nouvelle startup
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
