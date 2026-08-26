'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from './supabase';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  image_url: string;
  status: string;
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    setLoading(true);
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('status', 'disponible');

    if (error) {
      console.error('Error al cargar mascotas:', error);
    } else {
      setPets(data || []);
    }
    setLoading(false);
  }

  async function handleAdoptSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPet) return;

    setSending(true);
    const { error } = await supabase.from('adoption_requests').insert([
      {
        pet_id: selectedPet.id,
        applicant_id: '00000000-0000-0000-0000-000000000000',
        message: message,
        status: 'pendiente',
      },
    ]);

    setSending(false);
    if (error) {
      alert('Error al enviar la solicitud: ' + error.message);
    } else {
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setSelectedPet(null);
        setMessage('');
      }, 2000);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-pink-600">🐾 PetMatch</h1>
        <div className="space-x-4">
          <Link
            href="/solicitudes"
            className="text-pink-600 border border-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors inline-block"
          >
            Ver Solicitudes
          </Link>
          <Link
            href="/nueva-mascota"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            + Publicar Mascota
          </Link>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700">
            Iniciar Sesión
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mascotas en Adopción</h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando mascotas...</p>
        ) : pets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-500 text-lg">Aún no hay mascotas registradas para adopción.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
                <img
                  src={pet.image_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                  <p className="text-sm text-gray-600">{pet.breed} • {pet.age} años</p>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{pet.description}</p>
                  <button
                    onClick={() => setSelectedPet(pet)}
                    className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600"
                  >
                    Solicitar Adopción
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Solicitud */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPet(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Adoptar a {selectedPet.name} 🐾
            </h3>

            {sentSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center my-4">
                ¡Solicitud enviada con éxito!
              </div>
            ) : (
              <form onSubmit={handleAdoptSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje para el refugio:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos por qué quieres adoptar a esta mascota..."
                    className="w-full border rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
                >
                  {sending ? 'Enviando...' : 'Confirmar Solicitud'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}