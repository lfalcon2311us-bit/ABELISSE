# ABELISSE — Réplica de diseño (HTML / CSS / JS)

Esta es la réplica visual de abelisse.com construida a partir del video que me
compartiste. Incluye 5 páginas + estilos + un poco de JS para que el front-end
se vea y se sienta como el real, lista para que conectes tu backend.

## Estructura

```
abelisse-site/
├── index.html                    Inicio (hero, categorías, 4 secciones de productos)
├── productos.html                Listado con filtros (categoría / subcategoría / marca)
├── ofertas.html                  Listado de productos en oferta
├── contacto.html                 Formulario de contacto
├── carrito.html                  Carrito (estado vacío y con productos)
├── politica-de-privacidad.html   Página legal de ejemplo
├── terminos-y-condiciones.html   Página legal de ejemplo
├── envios-y-devoluciones.html    Página legal de ejemplo
├── css/style.css                 Todos los estilos (variables de color, tipografía, componentes)
└── js/main.js                    Menú móvil, carrito demo (localStorage), formulario de contacto
```

Abre `index.html` directamente en el navegador (o sirve la carpeta con
cualquier servidor estático) para verla funcionando.

## Lo que SÍ está funcionando ya (demo con localStorage)

- Botón ☰ de menú móvil.
- "Añadir al carrito" en cualquier tarjeta de producto → suma al carrito,
  actualiza el contador del header y muestra una notificación.
- `carrito.html` lee ese carrito y alterna automáticamente entre el estado
  "vacío" y el estado "con productos" (stepper de cantidad, eliminar, vaciar
  carrito, total).
- El formulario de contacto muestra una confirmación visual al enviarse.

Todo esto vive en `localStorage` solo para que puedas ver los dos estados de
cada pantalla sin backend. Cuando conectes tu base de datos / API, vas a
reemplazar esas funciones (están todas comentadas en `js/main.js`) por tus
llamadas reales.

## Lo que falta conectar (tú lo harás, como pediste)

- **Catálogo real de productos**: los productos de cada página son de
  ejemplo (marcados con comentarios `<!-- Productos de ejemplo -->` en el
  HTML). Lo ideal es que termines generando estas tarjetas desde tu backend.
- **Filtros de productos.html**: los `<select>` están maquetados pero no
  filtran nada todavía.
- **Pagos**: los botones "Pagar con Stripe" / "PayPal" / "Pay Later" /
  "Tarjeta" son solo visuales.
- **Envío del formulario de contacto**: hoy solo muestra un toast, no manda
  el correo.
- **Logo e imágenes reales**: usé íconos SVG e ilustraciones propias como
  marcador de posición (sin depender de fotos con derechos de autor). Puedes
  reemplazar el `<svg>` del hero y los `.product-card__media` por tus fotos
  reales sin tocar el resto del CSS.

## Notas de diseño

- Tipografías: Poppins (títulos) + Inter (texto), cargadas desde Google
  Fonts en `css/style.css` — necesitas conexión a internet para que se vean
  exactamente igual; si no, el navegador usa una fuente de respaldo similar.
- Paleta de color extraída directamente de tu sitio: rosa principal
  `#f85b99`, rosa de precios/acentos `#e83d76`, fondo del footer `#f8f9fc`,
  botón "Tarjeta" `#2b2c2f`.
- Todo el layout es responsive (probado en escritorio y en ~390px de ancho).
