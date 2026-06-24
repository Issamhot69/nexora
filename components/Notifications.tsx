'use client'
import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning'
  title: string
  message: string
  time: string
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'success', title: '✅ Site généré', message: 'FastFoodGenie est prêt à être téléchargé', time: 'il y a 2 min' },
  { id: '2', type: 'info', title: '💡 Nouvelle idée', message: 'Essaie le module Startup DNA pour personnaliser ton projet', time: 'il y a 10 min' },
  { id: '3', type: 'warning', title: '⚡ Limite atteinte', message: 'Tu as utilisé 15/20 générations ce mois', time: 'il y a 1h' },
]

export default function Notifications() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unread, setUnread] = useState(3)

  const markAllRead = () => setUnread(0)
  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnread(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="relative">
      <button onClick={() => { setOpen(!open); if (open) markAllRead() }}
        className="relative p-2 rounded-xl hover:bg-gray-800 transition-all">
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className="font-semibold">Notifications</span>
            <button onClick={markAllRead} className="text-xs text-indigo-400 hover:text-indigo-300">
              Tout marquer lu
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Aucune notification</div>
            ) : notifications.map(n => (
              <div key={n.id} className="p-4 border-b border-gray-800 hover:bg-gray-800 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-gray-400 text-xs mt-1">{n.message}</div>
                    <div className="text-gray-600 text-xs mt-1">{n.time}</div>
                  </div>
                  <button onClick={() => dismiss(n.id)} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 text-center border-t border-gray-800">
            <button className="text-xs text-indigo-400 hover:text-indigo-300">Voir toutes les notifications</button>
          </div>
        </div>
      )}
    </div>
  )
}
