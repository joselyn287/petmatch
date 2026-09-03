import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900">
          🐾 PetMatch
        </h1>
        <p className="text-lg text-gray-600">
          Plataforma de adopción de mascotas conectada con Supabase y autenticación segura.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/api-mascotas"
            className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl shadow hover:bg-pink-700 transition"
          >
            Ver Consumo de API Externa (Fetch)
          </Link>
          
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl shadow hover:bg-gray-900 transition"
          >
            Panel de Administración
          </Link>
        </div>
      </div>
    </main>
  )
}