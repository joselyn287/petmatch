'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface AdoptionRequest {
  id: string;
  message: string;
  status: string;
  created_at: string;
  pets: {
    name: string;
    breed: string;
  } | null;
}

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(name, breed)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar solicitudes:', error);
    } else {
      setRequests(data as unknown as AdoptionRequest[]);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('adoption_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado: ' + error.message);
    } else {
      fetchRequests();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-pink-600">🐾 Solicitudes de Adopción</h1>
        <Link
          href="/"
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Volver al Catálogo
        </Link>
      </header>

      <section className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-500 text-lg">No hay solicitudes registradas aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Mascota: {req.pets?.name || 'Mascota'} <span className="text-sm font-normal text-gray-500">({req.pets?.breed})</span>
                  </h3>
                  <p className="text-gray-600 text-sm mt-2"><strong>Mensaje:</strong> "{req.message}"</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Estado actual: <span className="font-semibold capitalize text-pink-600">{req.status}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateStatus(req.id, 'aprobada')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'rechazada')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}