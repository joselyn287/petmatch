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
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">🐾 PetMatch</h1>
          <div className="space-x-4">
            <Link
              href="/api-mascotas"
              className="text-pink-600 hover:underline font-semibold"
            >
              Ver API Externa
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition text-sm font-semibold"
            >
              Administración
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mascotas Disponibles para Adopción</h2>

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Cargando mascotas disponibles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mascotas.map((mascota) => (
              <div key={mascota.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                {mascota.imagen && (
                  <img src={mascota.imagen} alt={mascota.nombre} className="h-48 w-full object-cover" />
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{mascota.nombre}</h3>
                    <p className="text-gray-600">Especie: {mascota.especie}</p>
                    <p className="text-gray-600">Edad: {mascota.edad}</p>
                  </div>
                  
                  <button 
                    onClick={() => alert(`Solicitud de adopción enviada para ${mascota.nombre}`)}
                    className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-700 transition"
                  >
                    Solicitar Adopción
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}