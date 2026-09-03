'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('adoption_requests')
        .select('*');

      if (fetchError) throw fetchError;

      if (data) {
        setRequests(data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar las solicitudes de adopción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Barra de navegación superior con rutas funcionales */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-pink-600">PetMatch Admin</h1>
            <nav className="hidden md:flex gap-4">
              <Link href="/solicitudes" className="text-sm font-semibold text-pink-600 border-b-2 border-pink-600 pb-1">
                Solicitudes
              </Link>
              <Link href="/mascotas" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                Mascotas
              </Link>
              <Link href="/usuarios" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                Usuarios
              </Link>
            </nav>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Cerrar Sesión
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Panel de Solicitudes</h2>
          <p className="text-sm text-slate-500">Gestiona las solicitudes de adopción de mascotas</p>
        </div>

        {loading && (
          <div className="text-center py-10 text-slate-500">Cargando solicitudes...</div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500">No hay solicitudes de adopción registradas.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req.id} className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Solicitud de Adopción
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-medium">ID Mascota:</span> {req.pet_id}
                  </p>
                  {req.message && (
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">Mensaje:</span> {req.message}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs text-slate-400">
                    ID Solicitud: {req.id}
                  </span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    req.status === 'aprobado' ? 'bg-emerald-100 text-emerald-700' : 
                    req.status === 'rechazado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status || 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}