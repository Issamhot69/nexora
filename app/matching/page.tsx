'use client'
import { useState } from 'react'

const profiles = [
  { id: 'tech', icon: '👨‍💻', name: 'Tech / Développeur', desc: 'Code, architecture, produit' },
  { id: 'business', icon: '💼', name: 'Business / CEO', desc: 'Ventes, stratégie, réseau' },
  { id: 'design', icon: '🎨', name: 'Design / UX', desc: 'Interface, expérience, brand' },
  { id: 'marketing', icon: '📣', name: 'Marketing / Growth', desc: 'Acquisition, SEO, contenu' },
  { id: 'finance', icon: '💰', name: 'Finance / CFO', desc: 'Comptabilité, levée de fonds' },
  { id: 'data', icon: '📊', name: 'Data / IA', desc: 'Machine learning, analytics' },
]

const mockProfiles = [
  { id: 1, name: 'Sarah K.', role: '👨‍💻 CTO', skills: 'React, Node, AWS', location: '🇫🇷 Paris', match: 95, bio: '5 ans d\'expérience en SaaS B2B. Cherche un co-fondateur business pour lancer une startup FinTech.' },
  { id: 2, name: 'Mohamed A.', role: '📣 Growth', skills: 'SEO, Ads, Content', location: '🇦🇪 Dubai', match: 88, bio: 'Ex-Growth Manager chez Careem. Cherche un CTO pour lancer une app de livraison IA.' },
  { id: 3, name: 'Julia R.', role: '💼 CEO', skills: 'Sales, Strategy, Network', location: '🇩🇪 Berlin', match: 82, bio: 'Serial entrepreneur, 2 exits. Cherche un développeur pour une plateforme EdTech.' },
  { id: 4, name: 'Alex T.', role: '📊 Data', skills: 'Python, ML, Analytics', location: '🇺🇸 NYC', match: 79, bio: 'Data Scientist ex-Google. Cherche co-fondateur pour startup IA dans la santé.' },
]

export default function Matching() {
  const [myProfile, setMyProfile] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [bio, setBio] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'find' | 'profiles'>('find')

  const generate = async () => {
    if (!myProfile || !bio) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: `${myProfile} — ${bio}`, lookingFor })
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">🤝 Co-Founder Matching</h1>
          <p className="text-gray-400 mt-2">Trouve ton co-fondateur idéal avec l'IA</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button onClick={() => setView('find')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${view === 'find' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            🔍 Trouver mon co-fondateur
          </button>
          <button onClick={() => setView('profiles')}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${view === 'profiles' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            👥 Profils disponibles ({mockProfiles.length})
          </button>
        </div>

        {view === 'find' ? (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Mon profil</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profiles.map(p => (
                  <button key={p.id} onClick={() => setMyProfile(p.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center ${myProfile === p.name ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs font-semibold">{p.name}</span>
                    <span className="text-xs opacity-60">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Je cherche</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profiles.map(p => (
                  <button key={p.id} onClick={() => setLookingFor(p.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center ${lookingFor === p.name ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Décris ton projet et ce que tu cherches chez un co-fondateur..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
              <button onClick={generate} disabled={loading || !myProfile || !bio}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                {loading ? '🤝 Recherche en cours...' : '🤝 Trouver mon co-fondateur idéal'}
              </button>
            </div>

            {result && (
              <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-indigo-400">🤝 Profil co-fondateur idéal</span>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProfiles.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 hover:border-indigo-600 rounded-2xl p-6 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <p className="text-sm text-indigo-400">{p.role}</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-700 rounded-xl px-3 py-1 text-center">
                    <div className="text-green-400 font-bold text-lg">{p.match}%</div>
                    <div className="text-green-600 text-xs">match</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3">{p.bio}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{p.location}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded-lg">{p.skills}</span>
                </div>
                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl transition-all text-sm">
                  💬 Contacter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
