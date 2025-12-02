'use client';

import ProductCard from './ProductCard';

const products = [
  {
    id: '1',
    name: 'HUBEL - Humic Acid 98% Potassium Humate, Suitable for All Crops, Enhances Root Mass, Brix Level, and Plant Growth',
    brand: 'Noble Crop Science',
    rating: 4.68,
    reviews: 467,
    originalPrice: 670,
    currentPrice: 261,
    discount: 409,
    discountPercent: 61,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F3748729181735026400.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2Fb019300ec1dcd5f9fb609b000e8b603c-12-24-24-14-43-03.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F9d3d19c670017070466917205f9ec8dd-12-24-24-14-43-10.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2Ff89d63a2c7f1503789f023d53cfe1973-12-24-24-14-43-17.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2Fca353da675ce19a23340abd5691ba112-12-24-24-14-43-27.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F6ab7ebe2b24d6cd2dd5fe1850b15ca3b-12-27-24-09-42-35.webp&w=1080&q=75',
    ],
    variants: [
      { name: '300 gm', quantity: '300 Gm x 1 Qty', price: 261, isBestSeller: true },
      { name: '600 gm', quantity: '300 Gm x 2 Qty', price: 387, isBestSeller: true },
      { name: '900 gm', quantity: '300 Gm x 3 Qty', price: 530, isBestSeller: true },
      { name: '900 gm', quantity: '900 Gm x 1 Qty', price: 490 },
      { name: '1500 gm', quantity: '300 Gm x 5 Qty', price: 695 },
      { name: '2700 gm', quantity: '900 Gm x 3 Qty', price: 1050 },
      { name: '3 kg', quantity: '300 Gm x 10 Qty', price: 1254 },
      { name: '4500 gm', quantity: '900 Gm x 5 Qty', price: 1645 },
    ],
    isBestSeller: true,
    freeDelivery: true,
    pricePerUnit: '(₹87.00 /100 gm)',
  },
  {
    id: '2',
    name: 'Pellot - Paclobutrazol 23% SC Plant Growth Regulator, Ideal for Mango and Other Major Vegetable Crops',
    brand: 'AgriBegri Trade Link Private Limited',
    rating: 4.49,
    reviews: 242,
    originalPrice: 3740,
    currentPrice: 1244,
    discount: 2496,
    discountPercent: 66,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F5099926071733209484.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F9191f2a34fd6415dddf08aa6205ee1fc-12-03-24-12-34-20.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2Fe4b99b6e2c2422a891a9703cf00e0de5-12-03-24-12-34-26.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2Fdb748ddd79254280448952b11fe33133-12-03-24-12-34-32.webp&w=1080&q=75',
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F311ca5b2b6ae02acef01de1127e3999d-12-03-24-12-34-38.webp&w=1080&q=75',
    ],
    variants: [
      { name: '500 ml', quantity: '500 ML x 1 Qty', price: 668, isBestSeller: true },
      { name: '1 liter', quantity: '500 ML x 2 Qty', price: 1244, isBestSeller: true },
      { name: '2 liter', quantity: '500 ML x 4 Qty', price: 2442 },
      { name: '5 liter', quantity: '500 ML x 10 Qty', price: 5724 },
      { name: '10 liter', quantity: '500 ML x 20 Qty', price: 10882 },
      { name: '50 liter', quantity: '500 ML x 100 Qty', price: 46403 },
    ],
    isBestSeller: true,
    freeDelivery: true,
    pricePerUnit: '(₹124.40 /100 ml)',
  },
  {
    id: '3',
    name: 'Clorentis Insecticide - Chlorantraniliprole 18.5% SC',
    brand: 'AgriBegri',
    rating: 4.3,
    reviews: 189,
    originalPrice: 460,
    currentPrice: 217,
    discount: 243,
    discountPercent: 52,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F3748729181735026400.webp&w=1080&q=75',
    ],
    variants: [
      { name: '30 ML', quantity: '30 ML X 1 Qty', price: 217 },
    ],
    isBestSeller: false,
    freeDelivery: true,
    pricePerUnit: '(₹723.33 /100 ml)',
  },
  {
    id: '4',
    name: 'Agrigib - Gibberellic Acid 0.001% L',
    brand: 'AgriBegri',
    rating: 4.2,
    reviews: 156,
    originalPrice: 480,
    currentPrice: 292,
    discount: 188,
    discountPercent: 39,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F3748729181735026400.webp&w=1080&q=75',
    ],
    variants: [
      { name: '500 ML', quantity: '500 ML x 1 Qty', price: 292 },
    ],
    isBestSeller: false,
    freeDelivery: true,
    pricePerUnit: '(₹58.40 /100 ml)',
  },
  {
    id: '5',
    name: 'Empala - Emamectin Benzoate 1.5% + Fipronil 3.5% SC Insecticide',
    brand: 'AgriBegri',
    rating: 4.4,
    reviews: 298,
    originalPrice: 910,
    currentPrice: 356,
    discount: 554,
    discountPercent: 60,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F3748729181735026400.webp&w=1080&q=75',
    ],
    variants: [
      { name: '250 ML', quantity: '250 ML x 1 Qty', price: 356 },
    ],
    isBestSeller: false,
    freeDelivery: true,
    pricePerUnit: '(₹142.40 /100 ml)',
  },
  {
    id: '6',
    name: 'Flow N - Nitrobenzene 35% Flowering Stimulant, Promotes Flowering and Fruit Setting',
    brand: 'AgriBegri',
    rating: 4.6,
    reviews: 412,
    originalPrice: 832,
    currentPrice: 369,
    discount: 463,
    discountPercent: 55,
    images: [
      'https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F3748729181735026400.webp&w=1080&q=75',
    ],
    variants: [
      { name: '500 ML', quantity: '500 ML x 1 Qty', price: 369 },
    ],
    isBestSeller: false,
    freeDelivery: true,
    pricePerUnit: '(₹73.80 /100 ml)',
  },
];

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
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[300px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
