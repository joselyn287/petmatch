'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Mascota {
  id: string
  nombre: string
  especie: string
  edad: string
  imagen?: string
}

interface Solicitud {
  id: string
  pet_id?: string
  applicant_id?: string
  status?: string
}

const mascotasEjemplo: Mascota[] = [
  {
    id: '1',
    nombre: 'Max',
    especie: 'Perro (Golden Retriever)',
    edad: '2 años',
    imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    nombre: 'Luna',
    especie: 'Gato (Siamés)',
    edad: '1 año',
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    nombre: 'Rocky',
    especie: 'Perro (Bulldog Francés)',
    edad: '3 años',
    imagen: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  }
]

export default function SolicitudesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)

  const ADMIN_EMAIL = 'andrea.delgado499@gmail.com'

  useEffect(() => {
    async function initData() {
      // 1. Verificar usuario autenticado
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email || null)

      // 2. Cargar mascotas desde Supabase o usar ejemplos
      const { data, error } = await supabase.from('mascotas').select('*')
      if (error || !data || data.length === 0) {
        setMascotas(mascotasEjemplo)
      } else {
        setMascotas(data)
      }

      // 3. Cargar solicitudes reales desde adoption_requests para el admin
      const { data: solData, error: solError } = await supabase.from('adoption_requests').select('*')
      if (!solError && solData) {
        setSolicitudes(solData)
      }

      setLoading(false)
    }
    initData()
  }, [])

  const isAdmin = userEmail === ADMIN_EMAIL

  if (loading) {
    return <p className="text-center mt-20 text-gray-500 font-medium animate-pulse">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8 border-b border-pink-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isAdmin ? 'Panel de Administración - Solicitudes' : 'Catálogo de Adopción'}
          </h1>
          <Link href="/" className="text-pink-600 font-semibold hover:underline">
            ← Volver al Inicio
          </Link>
        </div>

        {isAdmin ? (
          /* Vista exclusiva para el Administrador */
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-bold">Modo Administrador Activo ({userEmail})</p>
              <p className="text-sm text-green-600">Aquí puedes revisar, aprobar o rechazar las solicitudes de los usuarios.</p>
            </div>
            
            {solicitudes.length === 0 ? (
              <p className="text-gray-500 italic">No hay solicitudes pendientes de aprobación en este momento.</p>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((sol) => (
                  <div key={sol.id} className="border border-gray-200 p-4 rounded-xl flex justify-between items-center bg-gray-50">
                    <div>
                      <p className="text-sm font-bold text-gray-800">ID Solicitud: {sol.id}</p>
                      <p className="text-xs text-gray-600">Estado actual: <span className="font-semibold text-pink-600">{sol.status || 'pendiente'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Vista para el Usuario Regular: Muestra las mascotas para solicitar adopción */
          <div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8">
              <p className="text-yellow-800 font-bold">Bienvenido, {userEmail || 'Usuario'}</p>
              <p className="text-sm text-yellow-700">Explora las mascotas disponibles y envía tu solicitud de adopción.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mascotas.map((mascota) => (
                <div key={mascota.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition">
                  {mascota.imagen ? (
                    <img src={mascota.imagen} alt={mascota.nombre} className="h-52 w-full object-cover" />
                  ) : (
                    <div className="h-52 w-full bg-pink-100 flex items-center justify-center text-pink-400 font-semibold">Sin imagen</div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{mascota.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Especie:</span> {mascota.especie}</p>
                      <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Edad:</span> {mascota.edad}</p>
                    </div>
                    
                    <button 
                      onClick={() => alert(`¡Solicitud de adopción enviada con éxito para ${mascota.nombre}! Pronto nos comunicaremos contigo.`)}
                      className="w-full bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-pink-700 transition shadow-sm"
                    >
                      Solicitar Adopción
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}