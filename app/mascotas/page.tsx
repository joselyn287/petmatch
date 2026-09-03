'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MascotasPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const { data } = await supabase.from('pets').select('*');
      if (data) setPets(data);
    } catch (error) {
      console.error('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-pink-600">PetMatch Admin</h1>
            <nav className="hidden md:flex gap-4">
              <Link href="/solicitudes" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Solicitudes</Link>
              <Link href="/mascotas" className="text-sm font-semibold text-pink-600 border-b-2 border-pink-600 pb-1">Mascotas</Link>
              <Link href="/usuarios" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Usuarios</Link>
            </nav>
          </div>
          <Link href="/login" className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">Cerrar Sesión</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Panel de Mascotas</h2>
        <p className="text-sm text-slate-500 mb-6">Administra el catálogo de mascotas disponibles</p>
        {loading ? <p>Cargando mascotas...</p> : pets.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-100 text-slate-500">No hay mascotas registradas.</div>
        ) : (
          <div className="grid gap-4">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white p-4 rounded-xl border border-slate-100">
                <h3 className="font-bold text-lg">{pet.name || 'Mascota sin nombre'}</h3>
                <p className="text-sm text-slate-500">Especie: {pet.species}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}