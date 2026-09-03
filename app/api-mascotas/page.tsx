'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DogApiResponse {
  message: string
  status: string
}

export default function ApiMascotasPage() {
  const [dogImage, setDogImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const fetchRandomDog = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://dog.ceo/api/breeds/image/random')
      const data: DogApiResponse = await response.json()
      setDogImage(data.message)
    } catch (error) {
      console.error('Error al consumir la API externa:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomDog()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-pink-600 hover:underline font-semibold"
        >
          ← Volver al Inicio
        </Link>
      </div>

      <div className="p-6 max-w-md w-full bg-white rounded-xl shadow-md space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Mascotas desde API Externa</h2>
        <p className="text-sm text-gray-500">
          Demostración de consumo de API externa utilizando <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600">fetch()</code>.
        </p>
        
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <p className="text-gray-400 animate-pulse">Cargando perrito...</p>
          ) : (
            <img src={dogImage} alt="Perrito aleatorio" className="h-full w-full object-cover" />
          )}
        </div>

        <button
          onClick={fetchRandomDog}
          className="w-full px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg shadow hover:bg-pink-700 transition"
        >
          Cargar otro perrito
        </button>
      </div>
    </main>
  )
}