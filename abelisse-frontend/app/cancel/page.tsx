export default function CancelPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-red-600 mb-4">
        Pago cancelado ❌
      </h1>

      <p className="text-gray-700 mb-8">
        No te preocupes, puedes intentarlo nuevamente cuando quieras.
      </p>

      <a
        href="/"
        className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition font-medium"
      >
        Volver a la tienda
      </a>
    </main>
  );
}
