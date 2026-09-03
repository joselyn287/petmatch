'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados para la API Externa
  const [razas, setRazas] = useState<any[]>([])
  const [loadingApi, setLoadingApi] = useState(true)
  const [apiError, setApiError] = useState('')

  // Cargar datos de la API Externa al montar el componente
  useEffect(() => {
    async function fetchRazas() {
      try {
        const res = await fetch('https://api.thedogapi.com/v1/breeds?limit=6')
        if (!res.ok) {
          throw new Error('Error al consultar la API externa')
        }
        const data = await res.json()
        setRazas(data)
      } catch (err: any) {
        setApiError('No se pudieron cargar las razas de referencia.')
      } finally {
        setLoadingApi(false)
      }
    }

    fetchRazas()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Correo o contraseña incorrectos')
    } else {
      setSuccess('¡Inicio de sesión exitoso!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-10 px-4">
      {/* Contenedor Principal */}
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Formulario de Login */}
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md mx-auto border border-slate-100">
          <div className="text-center mb-6">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-pink-600 mt-2">PetMatch</h1>
            <p className="text-sm text-slate-500">Inicia sesión para gestionar adopciones</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100 text-center font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adoptante@test.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition text-sm shadow-sm"
            >
              Entrar
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-pink-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>

        {/* Sección de API Externa */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Catálogo de Razas de Referencia (API Externa)
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Información obtenida en tiempo real desde The Dog API.
          </p>

          {loadingApi && (
            <p className="text-sm text-slate-500 text-center py-4">Cargando razas desde API externa...</p>
          )}

          {apiError && (
            <p className="text-sm text-red-500 text-center py-4">{apiError}</p>
          )}

          {!loadingApi && !apiError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {razas.map((raza) => (
                <div key={raza.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-pink-600">{raza.name}</h3>
                  <p className="text-xs text-slate-600 mt-2">
                    <strong>Temperamento:</strong> {raza.temperament || 'No disponible'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Esperanza de vida:</strong> {raza.life_span}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}