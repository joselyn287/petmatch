import React from 'react'

export async function RazasAPI() {
  try {
    // Consumo de API REST externa pública mediante fetch + async/await
    const res = await fetch('https://api.thedogapi.com/v1/breeds?limit=6', {
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      throw new Error('Error al consultar la API externa')
    }

    const razas = await res.json()

    return (
      <section className="my-8 p-6 bg-white rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Catálogo de Razas de Referencia (API Externa)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {razas.map((raza: any) => (
            <div key={raza.id} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-semibold text-lg text-blue-600">{raza.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Temperamento:</strong> {raza.temperament || 'No especificado'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Esperanza de vida:</strong> {raza.life_span}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md my-4">
        <p>No se pudo conectar con la API externa de razas.</p>
      </div>
    );
  }
}