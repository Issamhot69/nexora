'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    id: 1,
    title: 'Bienvenue sur Nexoro ! 🎉',
    subtitle: 'La première AI Startup Factory au monde',
    content: (
      <div className="space-y-4 text-center">
        <div className="text-8xl mb-6">⚡</div>
        <p className="text-gray-300 text-lg leading-relaxed">
          En quelques minutes, tu vas pouvoir générer une startup complète — 
          idée, business model, site web, pitch deck, code source et bien plus.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🧬', label: 'Startup DNA' },
            { icon: '🚀', label: 'Launch in 5min' },
            { icon: '💰', label: 'Revenue Predictor' },
            { icon: '🤝', label: 'Co-Founder Match' },
            { icon: '💻', label: 'Code Generator' },
            { icon: '🔮', label: 'Competitor Killer' },
          ].map(f => (
            <div key={f.label} className="bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Comment ça marche ? 🤔',
    subtitle: '3 étapes simples pour lancer ta startup',
    content: (
      <div className="space-y-6">
        {[
          { num: '1', icon: '✍️', title: 'Décris ton idée', desc: 'Écris une phrase décrivant ta startup — ex: "Une app IA pour gérer les finances des freelances"' },
          { num: '2', icon: '⚡', title: 'Nexoro génère tout', desc: 'En moins de 5 minutes, l\'IA génère ton business model, site web, pitch deck, code source et stratégie marketing' },
          { num: '3', icon: '🚀', title: 'Lance ta startup', desc: 'Télécharge tous tes documents, déploie ton site et trouve tes premiers clients' },
        ].map(step => (
          <div key={step.num} className="flex gap-4 items-start bg-gray-800 rounded-2xl p-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">
              {step.num}
            </div>
            <div>
              <div className="font-semibold text-white mb-1">{step.icon} {step.title}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 3,
    title: 'Choisis ton objectif 🎯',
    subtitle: 'On va personnaliser Nexoro pour toi',
    content: null,
    isGoal: true,
  },
  {
    id: 4,
    title: 'Tu es prêt ! 🚀',
    subtitle: 'Commence à construire ta startup',
    content: (
      <div className="space-y-4 text-center">
        <div className="text-8xl mb-6">🎉</div>
        <p className="text-gray-300 text-lg">
          Nexoro est prêt à t'aider à construire ta startup.
          Commence par le module qui t'intéresse le plus !
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            { icon: '🧬', label: 'Découvrir mon idée', href: '/dna', color: 'bg-purple-600' },
            { icon: '🚀', label: 'Lancer en 5 minutes', href: '/launch', color: 'bg-indigo-600' },
            { icon: '🤖', label: 'Parler à mon Co-Founder IA', href: '/cofounder', color: 'bg-blue-600' },
            { icon: '💰', label: 'Prédire mes revenus', href: '/revenue', color: 'bg-green-600' },
          ].map(item => (
            <a key={item.href} href={item.href}
              className={`${item.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm text-center`}>
              {item.icon} {item.label}
            </a>
          ))}
        </div>
      </div>
    )
  }
]

const goals = [
  { id: 'idea', icon: '💡', label: 'J\'ai une idée à valider' },
  { id: 'launch', icon: '🚀', label: 'Je veux lancer vite' },
  { id: 'code', icon: '💻', label: 'Je veux générer du code' },
  { id: 'investor', icon: '💰', label: 'Je cherche des investisseurs' },
  { id: 'team', icon: '🤝', label: 'Je cherche un co-fondateur' },
  { id: 'agency', icon: '🏢', label: 'Je suis une agence' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const router = useRouter()

  const currentStep = steps[step]
  const isLast = step === steps.length - 1

  const next = () => {
    if (isLast) {
      localStorage.setItem('nexoro_onboarded', 'true')
      router.push('/')
    } else {
      setStep(prev => prev + 1)
    }
  }

  const goalRoutes: Record<string, string> = {
    idea: '/dna',
    launch: '/launch',
    code: '/codegen',
    investor: '/export',
    team: '/matching',
    agency: '/whitelabel',
  }

  const finish = () => {
    localStorage.setItem('nexoro_onboarded', 'true')
    localStorage.setItem('nexoro_goal', selectedGoal)
    if (selectedGoal) router.push(goalRoutes[selectedGoal] || '/')
    else router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-indigo-500 w-12' : 'bg-gray-700 w-8'}`} />
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">{currentStep.title}</h1>
            <p className="text-gray-400 mt-2">{currentStep.subtitle}</p>
          </div>

          {currentStep.isGoal ? (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {goals.map(goal => (
                <button key={goal.id} onClick={() => setSelectedGoal(goal.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${selectedGoal === goal.id ? 'bg-indigo-600 text-white border border-indigo-400' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-sm font-medium">{goal.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-8">{currentStep.content}</div>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(prev => prev - 1)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all text-sm">
                ← Retour
              </button>
            )}
            <button
              onClick={currentStep.isGoal ? finish : next}
              disabled={currentStep.isGoal && !selectedGoal}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
              {isLast ? '🚀 Commencer !' : currentStep.isGoal ? `✓ Continuer vers ${goals.find(g => g.id === selectedGoal)?.label || '...'}` : 'Suivant →'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          <button onClick={() => { localStorage.setItem('nexoro_onboarded', 'true'); router.push('/') }}
            className="hover:text-gray-400 transition-all">
            Passer l'introduction →
          </button>
        </p>
      </div>
    </div>
  )
}
