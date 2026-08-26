'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [pets, setPets] = useState<any[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // Cargar mascotas
    const fetchPets = async () => {
      const { data } = await supabase.from('pets').select('*')
      if (data) setPets(data)
    }
    
    // Verificar usuario autenticado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchPets()
    checkUser()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginError('Credenciales incorrectas: ' + error.message)
    } else {
      setUser(data.user)
      setShowLoginModal(false)
      setEmail('')
      setPassword('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <h1 className="text-xl font-bold text-pink-600">PetMatch</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <a href="/solicitudes" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition">
            Ver Solicitudes
          </a>
          <a href="/nueva-mascota" className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            + Publicar Mascota
          </a>
          
          {user ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cerrar Sesión ({user.email?.split('@')[0]})
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 text-sm font-medium bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition shadow-sm"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mascotas en Adopción</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                <img 
                  src={pet.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} 
                  alt={pet.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-800">{pet.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{pet.breed} • {pet.age} años</p>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{pet.description}</p>
                  <button className="w-full py-2 bg-pink-50 text-pink-600 font-semibold rounded-lg hover:bg-pink-100 transition border border-pink-200">
                    Solicitar Adopción
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 col-span-3 text-center py-12">Cargando catálogo de mascotas...</p>
          )}
        </div>
      </main>

      {/* VENTANA MODAL DE LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1">Iniciar Sesión</h3>
            <p className="text-sm text-slate-500 mb-4">Ingresa tus credenciales para continuar en PetMatch</p>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
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

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}