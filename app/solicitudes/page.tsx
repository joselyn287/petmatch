'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SolicitudesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email || null)
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) return <p className="text-center mt-10">Cargando...</p>

  // Definimos quién es el administrador autorizado
  const ADMIN_EMAIL = 'andrea.delgado499@gmail.com'
  const isAdmin = userEmail === ADMIN_EMAIL

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Solicitudes de Adopción</h1>

      {isAdmin ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <p className="text-green-800 font-semibold">Modo Administrador Activo</p>
          <p className="text-sm text-green-600">Tienes permisos para aprobar o rechazar solicitudes.</p>
          {/* Aquí va tu tabla o lista de solicitudes con los botones de Aprobar/Rechazar */}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-yellow-800 font-semibold">Vista de Usuario Regular</p>
          <p className="text-sm text-yellow-600">Tu solicitud ha sido registrada correctamente. Solo puedes ver el estado, no aprobar solicitudes.</p>
        </div>
      )}
    </div>
  )
}