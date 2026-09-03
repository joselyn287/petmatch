'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Mascota {
  id: string
  nombre: string
  especie: string
  edad: string
  imagen?: string
}

catalogo:
export default function CatalogoMascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMascotas() {
      // Reemplaza 'mascotas' con el nombre de tu tabla en Supabase si es diferente
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

  if (loading) return <p className="text-center mt-10">Cargando mascotas disponibles...</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Mascotas Disponibles para Adopción</h1>
      
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
              
              {/* Botón único para usuarios normales y admin (Solicitar Adopción) */}
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
    </div>
  )
}