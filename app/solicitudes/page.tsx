'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Configuración directa de Supabase
const supabaseUrl = 'https://brujnlgnalojjujnakmc.supabase.co';
const supabaseAnonKey = 'sb_publishable_FgZIT0x-bOEMOgrrg9K6ww_mi2-ZTdT';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AdoptionRequest {
  id: string;
  message: string;
  status: string;
  created_at: string;
  pets: {
    name: string;
    breed: string;
  }[] | null; // <-- Cambiado a arreglo o null para coincidir con Supabase
}

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
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
        .select(`
          id,
          message,
          status,
          created_at,
          pets (
            name,
            breed
          )
        `);

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setRequests(data as unknown as AdoptionRequest[]);
      }
    } catch (err: any) {
      setError('Error al cargar las solicitudes de adopción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-pink-600">Panel de Solicitudes</h1>
            <p className="text-sm text-slate-500">Gestiona las solicitudes de adopción de mascotas</p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition"
          >
            Cerrar Sesión / Volver
          </Link>
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
            <p className="text-slate-500">No hay solicitudes de adopción registradas por el momento.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="grid gap-4">
            {requests.map((req) => {
              const pet = req.pets && req.pets.length > 0 ? req.pets[0] : null;
              return (
                <div key={req.id} className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Mascota: {pet?.name || 'Desconocida'} ({pet?.breed || 'Sin raza'})
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">Mensaje: {req.message}</p>
                    <span className="inline-block mt-2 text-xs text-slate-400">
                      Fecha: {new Date(req.created_at).toLocaleDateString()}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
