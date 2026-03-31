export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-lg mb-2">ABELISSE</p>
          <p>Cosmética y belleza para realzar tu esencia cada día.</p>
        </div>

        <div>
          <p className="font-semibold mb-2">Información</p>
          <ul className="space-y-1">
            <li>Política de privacidad</li>
            <li>Términos y condiciones</li>
            <li>Envíos y devoluciones</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-2">Contacto</p>
          <ul className="space-y-1">
            <li>contacto@abelisse.com</li>
            <li>Instagram · Facebook</li>
            <li>Atención al cliente 24/7</li>
          </ul>
        </div>
      </div>

      <div className="border-t text-xs text-center py-4 text-gray-500">
        © {new Date().getFullYear()} ABELISSE. Todos los derechos reservados.
      </div>
    </footer>
  );
}
