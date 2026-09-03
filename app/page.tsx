'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Configuración de credenciales de Supabase
const supabaseUrl = 'https://brujnlgnalojjujnakmc.supabase.co'
const supabaseAnonKey = 'sb_publishable_FgZIT0x-bOEMOgrrg9K6ww_mi2-ZTdT'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Correo o contraseña incorrectos')
      } else {
        setMessage('¡Inicio de sesión exitoso!')
        
        // Redirige automáticamente a la sección de solicitudes tras 1 segundo
        setTimeout(() => {
          router.push('/solicitudes')
        }, 1000)
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-slate-100">
        <div className="text-center mb-6">
          <span className="text-3xl">🐾</span>
          <h1 className="mt-2 text-2xl font-bold text-pink-600">PetMatch</h1>
          <p className="text-sm text-slate-500">Inicia sesión para gestionar adopciones</p>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-600 border border-emerald-100">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-600 py-2 text-sm font-semibold text-white hover:bg-pink-700 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold text-pink-600 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}