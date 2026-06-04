'use client'
import { useState } from 'react'

export default function Studio() {
  const [logo, setLogo] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [video, setVideo] = useState('')
  const [siteName, setSiteName] = useState('')
  const [slogan, setSlogan] = useState('')

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🎨 Studio</h1>
          <p className="text-gray-500 mt-1">Configure ton site — logo, en-tête, vidéo</p>
        </div>

        {/* Nom du site */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">📝 Identité</h2>
          <input
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            placeholder="Nom de ton site / startup"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            value={slogan}
            onChange={e => setSlogan(e.target.value)}
            placeholder="Slogan / tagline"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Upload Logo */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">🖼️ Logo</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition-all">
            {logo ? (
              <img src={logo} alt="logo" className="max-h-24 object-contain" />
            ) : (
              <>
                <div className="text-4xl mb-2">📤</div>
                <p className="text-gray-400">Clique pour uploader ton logo</p>
                <p className="text-gray-600 text-sm mt-1">PNG, JPG, SVG</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, setLogo)} />
          </label>
        </div>

        {/* Upload Banner */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">🎨 En-tête / Bannière</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition-all">
            {banner ? (
              <img src={banner} alt="banner" className="w-full max-h-40 object-cover rounded-xl" />
            ) : (
              <>
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-400">Clique pour uploader ta bannière</p>
                <p className="text-gray-600 text-sm mt-1">1200x400px recommandé</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, setBanner)} />
          </label>
        </div>

        {/* Vidéo */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">🎬 Vidéo de présentation</h2>
          <input
            value={video}
            onChange={e => setVideo(e.target.value)}
            placeholder="Lien YouTube ou Vimeo (ex: https://youtube.com/...)"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          {video && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <iframe
                src={video.replace('watch?v=', 'embed/')}
                className="w-full h-48"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Bouton générer */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all text-lg">
          🚀 Générer le site avec ces assets
        </button>
      </div>
    </main>
  )
}
