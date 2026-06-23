'use client'
import { useState } from 'react'

const plugins = [
  { id: 'seo', icon: '🔍', name: 'SEO Automatique', desc: 'Meta tags, sitemap, robots.txt générés par IA', price: 'Free', category: 'Marketing', active: false },
  { id: 'email', icon: '📧', name: 'Email Marketing', desc: 'Séquences emails automatiques avec IA', price: '$9/mois', category: 'Marketing', active: false },
  { id: 'ecommerce', icon: '🛒', name: 'E-commerce', desc: 'Boutique complète + Stripe intégré', price: '$19/mois', category: 'Ventes', active: false },
  { id: 'analytics', icon: '📊', name: 'Analytics Pro', desc: 'Dashboard stats temps réel', price: '$5/mois', category: 'Analytics', active: false },
  { id: 'chat', icon: '💬', name: 'Live Chat IA', desc: 'Chatbot IA sur ton site 24/7', price: '$12/mois', category: 'Support', active: false },
  { id: 'booking', icon: '📅', name: 'Booking System', desc: 'Réservations et rendez-vous en ligne', price: '$9/mois', category: 'Productivité', active: false },
  { id: 'maps', icon: '🗺️', name: 'Google Maps', desc: 'Intégration carte et localisation', price: 'Free', category: 'Intégration', active: false },
  { id: 'social', icon: '📱', name: 'Social Media', desc: 'Auto-post sur Instagram, LinkedIn, X', price: '$15/mois', category: 'Marketing', active: false },
  { id: 'invoice', icon: '🧾', name: 'Facturation Pro', desc: 'Factures, devis, contrats PDF', price: '$7/mois', category: 'Finance', active: false },
  { id: 'multilang', icon: '🌍', name: 'Multi-langues', desc: 'AR, FR, EN, ES, ZH automatique', price: '$10/mois', category: 'Intégration', active: false },
  { id: 'cofounder', icon: '🤖', name: 'AI Co-Founder', desc: 'Agent IA qui challenge tes idées', price: '$29/mois', category: 'IA', active: false },
  { id: 'investor', icon: '💰', name: 'Investor Dashboard', desc: 'Lien privé pour investisseurs', price: '$19/mois', category: 'Finance', active: false },
]

const categories = ['Tous', 'Marketing', 'Ventes', 'Analytics', 'Support', 'Finance', 'IA', 'Intégration', 'Productivité']

export default function Store() {
  const [activePlugins, setActivePlugins] = useState<string[]>([])
  const [category, setCategory] = useState('Tous')

  const toggle = (id: string) => {
    setActivePlugins(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const filtered = category === 'Tous' ? plugins : plugins.filter(p => p.category === category)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🏪 Nexoro App Store</h1>
          <p className="text-gray-400 mt-2">Active les plugins pour booster ta startup</p>
          <div className="mt-2">
            <span className="text-indigo-400 font-semibold">{activePlugins.length} plugin{activePlugins.length > 1 ? 's' : ''} actif{activePlugins.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(plugin => {
            const isActive = activePlugins.includes(plugin.id)
            return (
              <div key={plugin.id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${isActive ? 'border-indigo-500' : 'border-gray-800 hover:border-gray-600'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{plugin.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${plugin.price === 'Free' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {plugin.price}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">{plugin.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{plugin.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">{plugin.category}</span>
                  <button onClick={() => toggle(plugin.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                    {isActive ? '✕ Désactiver' : '+ Activer'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
