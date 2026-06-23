'use client'
import { useState } from 'react'

const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'Gratuit',
    color: 'border-gray-700',
    badge: '',
    features: [
      '3 générations / mois',
      '2 modules IA',
      'Export texte',
      '1 projet sauvegardé',
      'Support communauté',
    ],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: '/ mois',
    color: 'border-indigo-500',
    badge: '⭐ Populaire',
    features: [
      'Générations illimitées',
      '8 modules IA complets',
      'Export PDF professionnel',
      'Projets illimités',
      'UI Builder + Preview',
      'AI Co-Founder',
      'Multi-langues 8 langues',
      'Support prioritaire',
    ],
    cta: 'Démarrer Pro',
    highlight: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 199,
    period: '/ mois',
    color: 'border-purple-500',
    badge: '🏷️ White Label',
    features: [
      'Tout le plan Pro',
      'Multi-clients illimités',
      'White Label — ta marque',
      'App Store complet',
      'Dashboard agence',
      'Rapports clients PDF',
      'API accès complet',
      'Support dédié 24/7',
    ],
    cta: 'Démarrer Agency',
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    period: '/ mois',
    color: 'border-yellow-500',
    badge: '💎 Premium',
    features: [
      'Tout le plan Agency',
      'Serveur dédié',
      'IA personnalisée',
      'Intégrations custom',
      'SLA 99.9% uptime',
      'Onboarding dédié',
      'Formation équipe',
      'Contrat sur mesure',
    ],
    cta: 'Contacter Sales',
    highlight: false,
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [annual, setAnnual] = useState(false)

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return
    setLoading(planId)
    await new Promise(r => setTimeout(r, 1500))
    alert(`✅ Stripe checkout pour le plan ${planId} — Clé Stripe à configurer dans .env.local`)
    setLoading(null)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">💳 Pricing</h1>
          <p className="text-gray-400 text-lg">Choisissez le plan qui correspond à votre ambition</p>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Mensuel</span>
            <button onClick={() => setAnnual(!annual)}
              className={`w-12 h-6 rounded-full transition-all ${annual ? 'bg-indigo-600' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-all mx-0.5 ${annual ? 'translate-x-6' : ''}`}></div>
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>Annuel <span className="text-green-400 font-semibold">-20%</span></span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-gray-900 border-2 ${plan.color} rounded-2xl p-6 flex flex-col relative ${plan.highlight ? 'scale-105' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${annual && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-gray-500 mb-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : plan.id === 'free'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? '⏳ Chargement...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">🔒 Paiement 100% sécurisé</h3>
          <p className="text-gray-500 text-sm">Powered by Stripe • Annulation à tout moment • Remboursement 30 jours</p>
        </div>
      </div>
    </main>
  )
}
