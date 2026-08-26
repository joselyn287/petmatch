'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Error al iniciar sesión: ' + error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Correo electrónico</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border p-2 rounded mt-1" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border p-2 rounded mt-1" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700">
          Entrar
        </button>
      </form>
    </div>
  )
}