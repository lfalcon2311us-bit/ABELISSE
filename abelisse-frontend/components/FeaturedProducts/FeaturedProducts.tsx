export default function FeaturedProducts() {
  const products = [
    { id: 1, name: "Serum Facial Premium", price: "$29.99" },
    { id: 2, name: "Crema Hidratante", price: "$19.99" },
    { id: 3, name: "Labial Matte Luxe", price: "$14.99" },
    { id: 4, name: "Perfume Rosé 50ml", price: "$49.99" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Productos Destacados
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              border border-transparent rounded-xl p-4 
              shadow-sm hover:shadow-md hover:-translate-y-1 
              transition bg-white
            "
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-3" />

            <h3 className="text-sm font-medium text-gray-800">
              {product.name}
            </h3>

            <p className="text-pink-600 font-semibold mt-1">
              {product.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
