"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const backend = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${backend}/api/contactar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (res.ok) {
        setSuccess(true);
        setNombre("");
        setEmail("");
        setMensaje("");
      } else {
        alert("Hubo un error al enviar tu mensaje.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contacto" },
        ]}
      />

      <h1 className="text-3xl font-semibold mb-4">Contáctanos</h1>

      <p className="text-gray-700 mb-10">
        ¿Tienes dudas, sugerencias o necesitas ayuda?  
        Estamos aquí para ti.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          ¡Gracias por tu mensaje! Te responderemos pronto.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-5"
      >
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Correo electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="tuemail@ejemplo.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mensaje</label>
          <textarea
            required
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 h-32"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </main>
  );
}
