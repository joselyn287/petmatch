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
  status?: string
}

interface UsuarioPerfil {
  id: string
  email?: string
}

const mascotasEjemplo: Mascota[] = [
  {
    id: 'Max',
    nombre: 'Max',
    especie: 'Perro (Golden Retriever)',
    edad: '2 años',
    imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Luna',
    nombre: 'Luna',
    especie: 'Gato (Siamés)',
    edad: '1 año',
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Rocky',
    nombre: 'Rocky',
    especie: 'Perro (Bulldog Francés)',
    edad: '3 años',
    imagen: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  }
]

export default function SolicitudesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioPerfil[]>([])
  const [loading, setLoading] = useState(true)

  const [adminTab, setAdminTab] = useState<'solicitudes' | 'usuarios'>('solicitudes')

  const ADMIN_EMAIL = 'andrea.delgado499@gmail.com'

  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email || null)

      const { data: solData } = await supabase.from('adoption_requests').select('*')
      if (solData) setSolicitudes(solData)

      const { data: profileData } = await supabase.from('profiles').select('*')
      if (profileData) setUsuarios(profileData)

      setLoading(false)
    }
    initData()
  }, [])

  const gestionarSolicitud = async (id: string, accion: 'aprobada' | 'rechazada') => {
    const { error } = await supabase
      .from('adoption_requests')
      .update({ status: accion })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar la solicitud.')
    } else {
      setSolicitudes(solicitudes.filter(s => s.id !== id))
      alert(`Solicitud ${accion} exitosamente.`)
    }
  }

  const isAdmin = userEmail === ADMIN_EMAIL

  if (loading) {
    return <p className="text-center mt-20 text-gray-500 font-medium animate-pulse">Cargando panel...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-pink-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isAdmin ? 'Panel de Administración' : 'Catálogo de Adopción'}
          </h1>
          <Link href="/" className="text-pink-600 font-semibold hover:underline">
            ← Volver al Inicio
          </Link>
        </div>

        {isAdmin ? (
          <div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-bold">Modo Administrador Activo ({userEmail})</p>
              <p className="text-sm text-green-600">Gestiona las solicitudes de adopción y revisa los usuarios.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-3">
              <button
                onClick={() => setAdminTab('solicitudes')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${adminTab === 'solicitudes' ? 'bg-pink-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                Solicitudes de Adopción
              </button>
              <button
                onClick={() => setAdminTab('usuarios')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${adminTab === 'usuarios' ? 'bg-pink-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                Gestión de Usuarios
              </button>
            </div>

            {adminTab === 'solicitudes' && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Solicitudes Recibidas</h2>
                {solicitudes.length === 0 ? (
                  <p className="text-gray-500 italic py-4">No hay solicitudes pendientes en este momento.</p>
                ) : (
                  <div className="space-y-4">
                    {solicitudes.map((sol) => (
                      <div key={sol.id} className="border border-gray-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
                        <div>
                          <p className="text-sm font-bold text-gray-800">ID Solicitud: {sol.id}</p>
                          <p className="text-xs text-gray-600 mt-1">Mascota: {sol.pet_id || 'General'}</p>
                          <p className="text-xs text-gray-600">Estado: <span className="font-semibold text-pink-600 uppercase">{sol.status || 'pendiente'}</span></p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => gestionarSolicitud(sol.id, 'aprobada')}
                            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => gestionarSolicitud(sol.id, 'rechazada')}
                            className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {adminTab === 'usuarios' && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Usuarios Registrados</h2>
                {usuarios.length === 0 ? (
                  <p className="text-gray-500 italic py-4">No hay perfiles adicionales registrados.</p>
                ) : (
                  <div className="space-y-3">
                    {usuarios.map((usr) => (
                      <div key={usr.id} className="border border-gray-200 p-3 rounded-xl bg-gray-50 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-800">{usr.email || `ID: ${usr.id}`}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Registrado</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8">
              <p className="text-yellow-800 font-bold">Bienvenido, {userEmail || 'Usuario'}</p>
              <p className="text-sm text-yellow-700">Explora las mascotas disponibles y envía tu solicitud de adopción.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mascotasEjemplo.map((mascota) => (
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
                      onClick={async () => {
                        // Enviamos el nombre de la mascota como pet_id para satisfacer la restricción not-null
                        const { error } = await supabase.from('adoption_requests').insert([
                          { 
                            pet_id: mascota.nombre, 
                            status: 'pendiente' 
                          }
                        ])

                        if (error) {
                          alert('Error al enviar la solicitud: ' + error.message)
                        } else {
                          alert(`¡Solicitud de adopción enviada con éxito para ${mascota.nombre}!`)
                        }
                      }}
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