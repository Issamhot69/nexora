'use client'
import { useState } from 'react'

const skillOptions = ['Développement', 'Design', 'Marketing', 'Ventes', 'Finance', 'Management', 'Data/IA', 'Juridique', 'Communication', 'Réseaux sociaux']
const budgetOptions = ['< $1,000', '$1,000 - $5,000', '$5,000 - $20,000', '$20,000 - $100,000', '> $100,000']
const experienceOptions = ['0-1 an', '1-3 ans', '3-5 ans', '5-10 ans', '+10 ans']
const timeOptions = ['5-10h/semaine', '10-20h/semaine', '20-30h/semaine', 'Full-time']

export default function DNA() {
  const [skills, setSkills] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [country, setCountry] = useState('')
  const [experience, setExperience] = useState('')
  const [interests, setInterests] = useState('')
  const [time, setTime] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const generate = async () => {
    if (skills.length === 0 || !budget || !country) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skills.join(', '), budget, country, experience, interests, time })
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
          <h1 className="text-3xl md:text-4xl font-bold">🧬 Startup DNA</h1>
          <p className="text-gray-400 mt-2">L'IA analyse ton profil et génère LA startup parfaite pour toi</p>
        </div>

        {/* Skills */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Tes compétences <span className="text-indigo-400">({skills.length} sélectionnées)</span></h2>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map(skill => (
              <button key={skill} onClick={() => toggleSkill(skill)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${skills.includes(skill) ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Budget & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Budget disponible</h2>
            <div className="space-y-2">
              {budgetOptions.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${budget === b ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Expérience</h2>
            <div className="space-y-2">
              {experienceOptions.map(e => (
                <button key={e} onClick={() => setExperience(e)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${experience === e ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time & Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Temps disponible</h2>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map(t => (
                <button key={t} onClick={() => setTime(t)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${time === t ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <input value={country} onChange={e => setCountry(e.target.value)}
            placeholder="🌍 Ton pays — Ex: France, USA, Canada..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <textarea value={interests} onChange={e => setInterests(e.target.value)}
            placeholder="Tes centres d'intérêt — Ex: technologie, santé, sport, éducation, finance..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || skills.length === 0 || !budget || !country}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {loading ? '🧬 Analyse de ton ADN startup...' : '🧬 Découvrir ma startup parfaite'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-400">🧬 Ton Startup DNA — Résultat personnalisé</span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
            <button onClick={() => navigator.clipboard.writeText(result)}
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-xl">
              📋 Copier
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
