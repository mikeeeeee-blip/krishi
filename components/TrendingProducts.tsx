'use client';

export default function TrendingProducts() {
  const trendingProducts = [
    'Vesicular Arbuscular Mycorrhiza',
    'Hydrogen Peroxide 30%',
    'Crop Tonic 21 Amino Acid',
    'Green Seaweed Extract',
    'Spinosad 45% SC',
    'Saprophytic Microorganisms',
    'Active Phosphorus And Potash',
    'Auxins: 05% w/v + Carboxylic Acid: 05% w/v + Elongation Hormones: 01% w/v',
    'Pest Out Pest Out Sucking Pest Controller',
    'NPK Microbial Consortia',
    'Size Fast Plant Growth Promoter',
    'Insta Bion Amino Acid',
    'Chitosan 10%',
    'Wet Gold Silicon Based Spreader',
    'Tomato Special Growth Enhancer',
    'Control TRM Sucking Pest Controller',
    'Fulvic Acid 98%',
    'Thiobacillus Spp.',
    'Hexaconazole 4% + Carbendazim 16% SC',
    'Brilliant Flowering Stimulant',
    'Dr.Bacto\'s Telya Kill',
    'Bascillus Subtilis',
    'Vesicular Arbuscular Mycorrhizae',
    'Ferrous Sulphate 19%',
    'Dr. Bacto\'s Bactomine',
    'Dr. Bactos Bacto DIP',
    'Dr. Bacto\'s Bacto Kit',
    'Ampelomyces Quisqualis',
    'Larva Lock Botanical Extracts',
    'Capsona Growth Enhancer',
  ];

  return (
    <section className="py-4 sm:py-5 md:py-6 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Trending Products</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {trendingProducts.map((product, index) => (
            <a
              key={index}
              href="#"
              className="inline-block px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-md text-[11px] sm:text-xs md:text-sm text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              {product}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

