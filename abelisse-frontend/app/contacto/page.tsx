export default function ContactoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-6">Contacto</h1>
      <p className="text-gray-600 mb-10">
        Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
      </p>

      <form className="grid grid-cols-1 gap-6">
        <input
          type="text"
          placeholder="Tu nombre"
          className="px-4 py-3 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Tu correo"
          className="px-4 py-3 border rounded-lg"
        />
        <textarea
          placeholder="Tu mensaje"
          className="px-4 py-3 border rounded-lg h-32"
        />
        <button className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
          Enviar mensaje
        </button>
      </form>
    </main>
  );
}
