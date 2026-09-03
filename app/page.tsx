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

export default function Home() {
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMascotas() {
      const { data, error } = await supabase.from('mascotas').select('*')
      if (error) {
        console.error('Error al cargar mascotas:', error)
      } else {
        setMascotas(data || [])
      }
      setLoading(false)
    }
    fetchMascotas()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Barra de navegación superior */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-pink-100">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <h1 className="text-2xl font-extrabold text-gray-900">PetMatch</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/api-mascotas"
            className="text-pink-600 hover:text-pink-700 font-semibold transition text-sm sm:text-base"
          >
            Ver API Externa
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-gray-900 text-white rounded-xl shadow hover:bg-gray-800 transition text-sm font-semibold"
          >
            Administración
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mascotas Disponibles para Adopción</h2>
          <p className="text-gray-600">Encuentra a tu nuevo compañero ideal y solicita una adopción.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 font-medium animate-pulse">Cargando mascotas disponibles...</p>
          </div>
        ) : mascotas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-500">No hay mascotas registradas en este momento.</p>
          </div>
        ) : (
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
                    onClick={() => alert(`¡Solicitud de adopción enviada con éxito para ${mascota.nombre}!`)}
                    className="w-full bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-pink-700 transition shadow-sm"
                  >
                    Solicitar Adopción
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}