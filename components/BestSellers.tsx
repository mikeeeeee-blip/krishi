export default function BestSellers() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Best Sellers</h2>
          <a href="#" className="text-[#16a34a] hover:text-[#15803d] font-semibold text-lg">
            View All →
          </a>
        </div>
        {/* Products grid will go here */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Placeholder for products */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

