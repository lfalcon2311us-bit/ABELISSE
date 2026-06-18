export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-700">

        {/* Marca */}
        <div>
          <p className="font-semibold text-2xl tracking-wide mb-4 text-gray-900">
            ABELISSE
          </p>
          <p className="text-gray-600 leading-relaxed">
            Cosmética y belleza para realzar tu esencia cada día.
          </p>
        </div>

        {/* Información */}
        <div>
          <p className="font-semibold text-lg mb-4 text-gray-900">Información</p>
          <ul className="space-y-2">
            <li>
              <a
                href="/politica-de-privacidad"
                className="hover:text-pink-600 transition-colors duration-200"
              >
                Política de privacidad
              </a>
            </li>
            <li>
              <a
                href="/terminos-y-condiciones"
                className="hover:text-pink-600 transition-colors duration-200"
              >
                Términos y condiciones
              </a>
            </li>
            <li>
              <a
                href="/envios-y-devoluciones"
                className="hover:text-pink-600 transition-colors duration-200"
              >
                Envíos y devoluciones
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="font-semibold text-lg mb-4 text-gray-900">Contacto</p>
          <ul className="space-y-3">
            <li className="text-gray-700">contacto@abelisse.com</li>

            <li className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/abelisse_usa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram ABELISSE"
                className="hover:text-pink-600 transition flex items-center gap-2"
              >
                <span className="text-xl">📸</span> Instagram
              </a>

              <span className="text-gray-400">·</span>

              <a
                href="https://www.tiktok.com/@abelisse_usa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok ABELISSE"
                className="hover:text-pink-600 transition flex items-center gap-2"
              >
                <span className="text-xl">🎵</span> TikTok
              </a>
            </li>

            <li className="text-gray-700">Atención al cliente 24/7</li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t text-xs text-center py-5 text-gray-500">
        © {new Date().getFullYear()} ABELISSE. Todos los derechos reservados.
      </div>
    </footer>
  );
}
