'use client'
import { useState } from 'react'

interface LigneFacture {
  id: string
  description: string
  quantite: number
  prix: number
}

export default function Factures() {
  const [client, setClient] = useState('')
  const [email, setEmail] = useState('')
  const [numero, setNumero] = useState('FAC-001')
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { id: '1', description: 'Création site web', quantite: 1, prix: 1500 }
  ])

  const addLigne = () => {
    setLignes([...lignes, { id: Date.now().toString(), description: '', quantite: 1, prix: 0 }])
  }

  const updateLigne = (id: string, field: string, value: string | number) => {
    setLignes(lignes.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const deleteLigne = (id: string) => {
    setLignes(lignes.filter(l => l.id !== id))
  }

  const total = lignes.reduce((sum, l) => sum + (l.quantite * l.prix), 0)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🧾 Factures</h1>
          <p className="text-gray-500 mt-1">Génère des factures professionnelles</p>
        </div>

        {/* Info facture */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">📋 Informations</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={numero}
              onChange={e => setNumero(e.target.value)}
              placeholder="Numéro facture"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              value={client}
              onChange={e => setClient(e.target.value)}
              placeholder="Nom du client"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email du client"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Lignes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">📦 Prestations</h2>
          <div className="space-y-3">
            {lignes.map(l => (
              <div key={l.id} className="flex gap-3 items-center">
                <input
                  value={l.description}
                  onChange={e => updateLigne(l.id, 'description', e.target.value)}
                  placeholder="Description"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={l.quantite}
                  onChange={e => updateLigne(l.id, 'quantite', Number(e.target.value))}
                  className="w-16 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={l.prix}
                  onChange={e => updateLigne(l.id, 'prix', Number(e.target.value))}
                  placeholder="Prix"
                  className="w-24 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-gray-400 w-24 text-right">${(l.quantite * l.prix).toLocaleString()}</span>
                <button onClick={() => deleteLigne(l.id)} className="text-red-400 hover:text-red-300">🗑️</button>
              </div>
            ))}
          </div>
          <button
            onClick={addLigne}
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            + Ajouter une ligne
          </button>

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold text-white">${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl transition-all">
            👁️ Aperçu PDF
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all">
            📥 Télécharger PDF
          </button>
        </div>
      </div>
    </main>
  )
}
