'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Mascota {
  id: string
  nombre?: string
  name?: string
  especie: string
  edad: string
  imagen?: string
}

export default function SolicitudesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email || null)

      // Cargar mascotas desde Supabase
      const { data: petsData } = await supabase.from('pets').select('*')
      if (petsData && petsData.length > 0) {
        setMascotas(petsData)
      } else {
        // Mascota por defecto si la tabla está vacía
        const defaultPet = {
          nombre: 'Max',
          name: 'Max',
          especie: 'Perro (Golden Retriever)',
          edad: '2 años',
          imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
        }
        const { data: inserted } = await supabase.from('pets').insert([defaultPet]).select()
        if (inserted) setMascotas(inserted)
      }

      setLoading(false)
    }
    initData()
  }, [])

  if (loading) {
    return <p className="text-center mt-20 text-gray-500 font-medium animate-pulse">Cargando catálogo...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-pink-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Catálogo de Adopción</h1>
          <Link href="/" className="text-pink-600 font-semibold hover:underline">
            ← Volver al Inicio
          </Link>
        </div>

        <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl mb-8">
          <p className="text-pink-900 font-bold">¡Bienvenido{userEmail ? `, ${userEmail}` : ''}!</p>
          <p className="text-sm text-pink-700">Elige la mascota que deseas adoptar y envía tu solicitud con un solo clic.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mascotas.map((mascota) => {
            const nombreMascota = mascota.nombre || mascota.name || 'Mascota'
            return (
              <div key={mascota.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition">
                {mascota.imagen ? (
                  <img src={mascota.imagen} alt={nombreMascota} className="h-52 w-full object-cover" />
                ) : (
                  <div className="h-52 w-full bg-pink-100 flex items-center justify-center text-pink-400 font-semibold">Sin imagen</div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{nombreMascota}</h3>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Especie:</span> {mascota.especie}</p>
                    <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Edad:</span> {mascota.edad}</p>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const { error } = await supabase.from('adoption_requests').insert([
                        { 
                          pet_id: mascota.id, 
                          status: 'pendiente' 
                        }
                      ])

                      if (error) {
                        alert('Error al enviar la solicitud: ' + error.message)
                      } else {
                        alert(`¡Solicitud de adopción enviada con éxito para ${nombreMascota}!`)
                      }
                    }}
                    className="w-full bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-pink-700 transition shadow-sm"
                  >
                    Solicitar Adopción
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}