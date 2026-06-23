'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      localStorage.setItem('nexoro_token', data.token)
      localStorage.setItem('nexoro_user', JSON.stringify(data.user))
      router.push('/')
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">⚡ Nexoro</h1>
          <p className="text-gray-500 mt-1">AI Startup Factory</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'login' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              Connexion
            </button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'register' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              Inscription
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all"
            >
              {loading ? '⏳ Chargement...' : mode === 'login' ? '🔑 Se connecter' : '🚀 Créer mon compte'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
