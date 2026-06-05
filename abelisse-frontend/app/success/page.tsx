export default function SuccessPage() {
  return (
    <main className="max-w-xl mx-auto text-center py-20 px-6">
      <h1 className="text-3xl font-semibold mb-4 text-green-600">
        Pago completado 🎉
      </h1>

      <p className="text-gray-700 mb-8">
        Gracias por tu compra. Tu pedido está siendo procesado y recibirás un
        correo de confirmación en breve.
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
