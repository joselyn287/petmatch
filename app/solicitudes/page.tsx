'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('adoption_requests').select('*');
      if (error) throw error;
      if (data) setRequests(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar la lista localmente para ver el cambio al instante
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err: any) {
      alert('Error al actualizar el estado: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-pink-600">PetMatch Admin</h1>
            <nav className="hidden md:flex gap-4">
              <Link href="/solicitudes" className="text-sm font-semibold text-pink-600 border-b-2 border-pink-600 pb-1">Solicitudes</Link>
              <Link href="/mascotas" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Mascotas</Link>
              <Link href="/usuarios" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Usuarios</Link>
            </nav>
          </div>
          <Link href="/login" className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">Cerrar Sesión</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Panel de Solicitudes</h2>
        <p className="text-sm text-slate-500 mb-6">Gestiona las solicitudes de adopción de mascotas</p>
        
        {loading ? (
          <p className="text-slate-500">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-100 text-slate-500">No hay solicitudes registradas.</div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => {
              const statusColor = 
                req.status === 'aprobado' ? 'bg-green-100 text-green-700 border-green-200' :
                req.status === 'rechazado' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-amber-100 text-amber-700 border-amber-200';

              return (
                <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-800">Solicitud de Adopción</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                        {req.status || 'pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600"><span className="font-medium">ID Mascota:</span> {req.pet_id}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Mensaje:</span> {req.message}</p>
                    <span className="text-xs text-slate-400 block pt-1">ID Solicitud: {req.id}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => updateStatus(req.id, 'aprobado')}
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, 'rechazado')}
                      className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}