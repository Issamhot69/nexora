'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/create')
  }, [])
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-white text-xl font-bold">Nexoro</p>
        <p className="text-gray-500 text-sm mt-2">Chargement...</p>
      </div>
    </div>
  )
}
