import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 font-sans">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-2">PetMatch</h1>
        <p className="text-sm text-slate-500 mb-6">Plataforma de gestión de solicitudes de adopción</p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/login" 
            className="w-full rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-pink-700 transition"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/solicitudes" 
            className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Ver Solicitudes Directo
          </Link>
        </div>
      </div>
    </main>
  );
}