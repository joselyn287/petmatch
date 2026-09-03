'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function NuevaMascota() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    image_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('pets').insert([
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        description: formData.description,
        image_url: formData.image_url,
        status: 'disponible',
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Error al publicar la mascota: ' + error.message);
    } else {
      alert('¡Mascota publicada con éxito! 🐾');
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrar Nueva Mascota 🐶🐱
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej: Tobías"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Raza / Especie</label>
            <input
              type="text"
              name="breed"
              required
              value={formData.breed}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej: Beagle / Mestizo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Edad (años)</label>
            <input
              type="number"
              name="age"
              required
              min="0"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej: 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la Imagen (Link)</label>
            <input
              type="url"
              name="image_url"
              required
              value={formData.image_url}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Describa su personalidad, comportamiento..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Publicar Mascota'}
          </button>
        </form>
      </div>
    </main>
  );
}