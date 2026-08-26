# 🐾 PetMatch - Sistema de Adopción de Mascotas

PetMatch es una plataforma web Full-Stack desarrollada con Next.js 14 y Supabase que conecta refugios de animales con personas interesadas en adoptar mascotas.

- **Demo en vivo (Vercel):** https://petmatch-eta.vercel.app
- **Video de defensa (YouTube/Drive):** PEGA_AQUÍ_TU_LINK_DEL_VIDEO

---

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Despliegue:** Vercel

---

## 👥 Roles de Usuario
- **Adoptante:** Puede explorar el catálogo de mascotas disponibles y enviar solicitudes de adopción directamente a los refugios.
- **Refugio:** Puede publicar nuevas mascotas en el sistema y gestionar (aprobar o rechazar) las solicitudes recibidas.

---

## 🗄️ Modelo de Datos
- `profiles`: Contiene la información extendida de los usuarios y asignación de roles.
- `pets`: Almacena el registro de mascotas, sus características y estado de disponibilidad.
- `adoption_requests`: Contiene los mensajes de los solicitantes vinculados a cada mascota.

---

## 🔑 Credenciales de Prueba
- **Rol Refugio:** `refugio@test.com` / `123456`
- **Rol Adoptante:** `adoptante@test.com` / `123456`

---

## 🚀 Instalación Local
```bash
git clone [https://github.com/joselyn287/petmatch.git](https://github.com/joselyn287/petmatch.git)
cd petmatch
npm install
npm run dev