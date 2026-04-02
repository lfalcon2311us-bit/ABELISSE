export default function CancelPage() {
  return (
    <div className="py-16 text-center px-4">
      <h1 className="text-3xl font-semibold mb-4">Pago cancelado ❌</h1>

      <p className="text-gray-700 mb-6">
        No te preocupes, puedes intentarlo nuevamente cuando quieras.
      </p>

      <a
        href="/"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        Volver a la tienda
      </a>
    </div>
  );
}
