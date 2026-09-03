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
      setLoading(true);
      const { data, error } = await supabase.from('pets').select('*');
      if (error) throw error;
      if (data) setPets(data);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (petId: string, petName: string) => {
    const message = prompt(`¿Deseas enviar una solicitud de adopción para ${petName}? Escribe un mensaje opcional:`);
    if (message === null) return;

    try {
      // Obtenemos la sesión del usuario actual autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        alert('Debes iniciar sesión para poder enviar una solicitud de adopción.');
        return;
      }

      const userId = session.user.id;

      // Insertamos la solicitud usando el ID del usuario autenticado real
      const { error } = await supabase.from('adoption_requests').insert([
        { 
          pet_id: petId, 
          applicant_id: userId, 
          message: message || 'Hola, me encantaría adoptar a esta mascota', 
          status: 'pendiente' 
        }
      ]);

      if (error) throw error;
      alert(`¡Solicitud enviada con éxito para ${petName}! Revisa el panel de Solicitudes.`);
    } catch (err: any) {
      alert('Error al enviar la solicitud: ' + err.message);
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
        <p className="text-sm text-slate-500 mb-6">Administra el catálogo y genera solicitudes de adopción</p>
        
        {loading ? (
          <p className="text-slate-500">Cargando mascotas...</p>
        ) : pets.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-100 text-slate-500">No hay mascotas registradas.</div>
        ) : (
          <div className="grid gap-4">
            {pets.map((pet) => {
              const petImage = pet.image || pet.image_url || pet.photo || pet.foto;
              const petSpecies = pet.species || pet.tipo || pet.breed || pet.raza;

              return (
                <div key={pet.id} className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {petImage ? (
                      <img 
                        src={petImage} 
                        alt={pet.name || 'Mascota'} 
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        Sin foto
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{pet.name || 'Mascota sin nombre'}</h3>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium">Detalle:</span> {petSpecies || 'No especificado'}
                      </p>
                      <span className="text-xs text-slate-400">ID: {pet.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdopt(pet.id, pet.name || 'Mascota')}
                    className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"
                  >
                    Adoptar / Solicitar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}