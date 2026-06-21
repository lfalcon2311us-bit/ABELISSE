"use client";

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

              {/* Instagram */}
              <a
                href="https://www.instagram.com/abelisse_usa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram ABELISSE"
                className="hover:text-pink-600 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Instagram
              </a>

              <span className="text-gray-400">·</span>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@abelisse_usa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok ABELISSE"
                className="hover:text-pink-600 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.5 2c.3 0 .6.2.6.5.2 2.2 1.8 3.9 4 4 .3 0 .5.3.5.6v2.1c0 .3-.3.6-.6.6-1.7 0-3.3-.6-4.5-1.7v6.9c0 2.6-2.1 4.8-4.8 4.8S3 17.6 3 15s2.1-4.8 4.8-4.8c.3 0 .6.3.6.6v2.2c0 .3-.3.6-.6.6-1.2 0-2.2 1-2.2 2.2S6.6 18 7.8 18s2.2-1 2.2-2.2V2.5c0-.3.3-.5.5-.5h2z" />
                </svg>
                TikTok
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
