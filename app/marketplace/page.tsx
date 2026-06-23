'use client'
import { useState } from 'react'

const startups = [
  { id: 1, name: 'EcoCycle', category: 'CleanTech', desc: 'AI platform for smart household recycling', raised: '$120K', stage: 'Seed', team: 2, logo: '♻️', tags: ['IA', 'Green', 'B2C'] },
  { id: 2, name: 'MediSync', category: 'HealthTech', desc: 'Real-time patient data synchronization for hospitals', raised: '$450K', stage: 'Series A', team: 8, logo: '🏥', tags: ['Santé', 'SaaS', 'B2B'] },
  { id: 3, name: 'FreelanceAI', category: 'Future of Work', desc: 'AI matching platform for global freelancers', raised: '$80K', stage: 'Pre-seed', team: 3, logo: '💼', tags: ['IA', 'Marketplace', 'B2B'] },
  { id: 4, name: 'ShopGenius', category: 'E-commerce', desc: 'AI-powered product recommendations engine', raised: '$200K', stage: 'Seed', team: 5, logo: '🛒', tags: ['IA', 'E-commerce', 'B2B'] },
  { id: 5, name: 'EduPath', category: 'EdTech', desc: 'Personalized learning journeys with AI tutors', raised: '$300K', stage: 'Seed', team: 6, logo: '📚', tags: ['IA', 'Education', 'B2C'] },
  { id: 6, name: 'PropTech AI', category: 'Real Estate', desc: 'AI valuation and matching for real estate', raised: '$550K', stage: 'Series A', team: 10, logo: '🏠', tags: ['IA', 'Immobilier', 'B2B'] },
]

const categories = ['Tous', 'CleanTech', 'HealthTech', 'Future of Work', 'E-commerce', 'EdTech', 'Real Estate']
const stages = ['Tous', 'Pre-seed', 'Seed', 'Series A']

export default function Marketplace() {
  const [category, setCategory] = useState('Tous')
  const [stage, setStage] = useState('Tous')
  const [search, setSearch] = useState('')

  const filtered = startups.filter(s => {
    const matchCat = category === 'Tous' || s.category === category
    const matchStage = stage === 'Tous' || s.stage === stage
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchStage && matchSearch
  })

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🌍 Marketplace</h1>
          <p className="text-gray-400 mt-2">Startups générées avec Nexoro — investissez, rejoignez, collaborez</p>
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher une startup..."
          className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${category === c ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {stages.map(s => (
              <button key={s} onClick={() => setStage(s)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${stage === s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(startup => (
            <div key={startup.id} className="bg-gray-900 border border-gray-800 hover:border-indigo-600 rounded-2xl p-6 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{startup.logo}</span>
                  <div>
                    <h3 className="font-bold text-white">{startup.name}</h3>
                    <p className="text-xs text-gray-500">{startup.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  startup.stage === 'Series A' ? 'bg-green-900 text-green-400' :
                  startup.stage === 'Seed' ? 'bg-blue-900 text-blue-400' :
                  'bg-gray-800 text-gray-400'
                }`}>{startup.stage}</span>
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{startup.desc}</p>

              <div className="flex gap-1 flex-wrap mb-4">
                {startup.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="text-sm">
                  <span className="text-green-400 font-semibold">{startup.raised}</span>
                  <span className="text-gray-500"> levés</span>
                </div>
                <div className="text-sm text-gray-500">
                  👥 {startup.team} membres
                </div>
              </div>

              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl transition-all text-sm">
                Voir le profil →
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p>Aucune startup trouvée</p>
          </div>
        )}
      </div>
    </main>
  )
}
