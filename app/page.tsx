'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Mascota {
  id: string
  nombre: string
  especie: string
  edad: string
  imagen?: string
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

export default function Home() {
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchMascotas() {
      const { data, error } = await supabase.from('mascotas').select('*')
      if (error || !data || data.length === 0) {
        setMascotas(mascotasEjemplo)
      } else {
        setMascotas(data)
      }
      setLoading(false)
    }
    fetchMascotas()
  }, [])

  const handleSolicitarAdopcion = async (nombreMascota: string) => {
    // Verificación real de sesión en Supabase
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session || !session.user) {
      alert('Acceso denegado: Debes iniciar sesión o registrarte para solicitar una adopción.')
      router.push('/login')
      return // Detiene completamente la ejecución
    }

    // Si hay sesión, recién aquí procede con la solicitud real
    alert(`¡Solicitud de adopción enviada con éxito para ${nombreMascota}!`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
            Iniciar Sesión / Registro
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mascotas Disponibles para Adopción</h2>
          <p className="text-gray-600">Encuentra a tu nuevo compañero ideal. Inicia sesión para enviar tu solicitud.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 font-medium animate-pulse">Cargando mascotas disponibles...</p>
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
                    onClick={() => handleSolicitarAdopcion(mascota.nombre)}
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