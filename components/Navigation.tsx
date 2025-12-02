'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SubCategory {
  name: string;
  items: string[];
}

interface Category {
  name: string;
  subCategories?: SubCategory[];
  items?: string[];
}

const categories: Category[] = [
  {
    name: 'Growth Regulators',
    items: [
      'Humic Acid',
      'Yield Booster',
      'Fruit Quality Enhancer',
      'PGR / PGP / PGH',
      'Zymes',
      'Crop Special',
      'Root And Soil Fertility Booster',
      'Flowering Stimulants',
      'Humic & Fulvic Acid',
      'pH Balancer',
    ],
  },
  {
    name: 'Organic Farming',
    items: [
      'Organic Remedial Inputs',
      'Vermi Compost',
      'Organic Fertilizer',
      'Neem Oil',
      'Waste Decomposer',
      'Viricides',
    ],
  },
  {
    name: 'Crop Protection',
    items: [
      'Nematicide',
      'Adjuvants',
      'Bactericides',
      'Insecticides',
      'Animal Repellent',
      'Combo Product',
      'Herbicides',
      'Fungicides',
      'Acaricide | Miticide',
      'Bio Pesticides',
      'Disinfectant & Sanitation',
    ],
  },
  {
    name: 'Har Din Sasta',
    items: [],
  },
  {
    name: 'Seeds',
    items: [
      'Onion',
      'Seeds Ball',
      'Cotton Seeds',
      'MARIGOLD',
      'Exotic Vegetable',
      'PULSE CROP',
      'VEGETABLE',
      'Leafy Vegetable',
      'FIELD CROP',
      'FRUIT CROP',
      'Desi Seeds',
      'Mushroom',
      'Root and Tuber Crop',
    ],
  },
  {
    name: 'Equipments',
    items: [
      'Earth Auger',
      'Vermicompost Bed',
      'Chain Saw',
      'Traps',
      'Hedge Trimmer',
      'Weed Mat',
      'Agricultural Hardware',
      'Pond Liner',
      'Azolla Bed',
      'Soil Testing Tools',
      'Torch',
      'Biofloc Tarpaulin',
      'Weeders',
      'Brush Cutter',
      'Spray Pump',
      'Water Pump',
      'Mulching Paper',
      'Fogging Machine',
      'Solar Agriculture Products',
      'Chaff Cutter',
      'Tarpaulin',
      'Crop Cover',
    ],
  },
  {
    name: 'Fertilizers',
    items: [
      'Chelated Micronutrient Fertilizer',
      'Water Soluble Fertilizers',
      'Bio Fertilizers',
      'Organic Fertilizers',
      'Liquid Fertilizers',
      'Bulk Fertilizer',
      'Root Fertility Booster',
      'Micronutrients Fertilizers',
    ],
  },
  {
    name: 'Irrigation',
    items: [
      'Rain Pipe',
      'Drip Irrigation Accessories',
      'Pipe & Fitting',
      'Sprinkler',
      'Drip Irrigation Kit',
    ],
  },
  {
    name: 'Gardening',
    items: [
      'Grow Bag',
      'Pesticides',
      'Gardening Kit',
      'Coco Peat',
      'Waste Compost Management',
      'Spray Pumps',
      'Accesssories',
      'Lawn Mowers',
      'Seeds',
      'FLOWER SEEDS',
      'Garden Shade Net',
      'Fertilizer',
      'Transplanting/ Repotting Mat',
      'Tools',
      'Pebbles',
      'Fertilizer Blend',
      'De Oiled Cake',
    ],
  },
  {
    name: 'Bulk',
    items: [
      'Remedies',
      'Mulching Sheet',
      'Seeds',
      'Equipments',
      'Organic Products',
      'Irrigation Parts',
      'Fertilizers',
      'Disinfectant & Sanitation',
    ],
  },
  {
    name: 'Cattle & Bird Care',
    items: [
      'Goat And Sheep Care',
      'Poultry Feed Supplements',
      'Aqua Care',
      'Mosquito Net',
      'Fodder Seed',
      'Animal Health Supplements',
      'Mineral Mixture',
      'Swine Supplement',
      'Aquaculture Feed Additives',
      'Bird Food',
      'Silage Bag (Murghas Bag)',
    ],
  },
];

export default function Navigation() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav className="bg-[#16a34a] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group flex-shrink-0"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button className="px-3 md:px-4 py-2.5 md:py-3 hover:bg-[#15803d] transition-colors flex items-center gap-1 whitespace-nowrap text-sm md:text-base font-medium">
                <span>{category.name}</span>
                {category.items && category.items.length > 0 && (
                  <ChevronDown size={14} className="md:w-4 md:h-4" />
                )}
              </button>

              {/* Dropdown Menu */}
              {hoveredCategory === category.name && category.items && category.items.length > 0 && (
                <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg z-50 min-w-[250px] max-h-[500px] overflow-y-auto rounded-md border border-gray-200">
                  <div className="py-2">
                    {category.items.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2 hover:bg-green-50 hover:text-green-600 transition-colors text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

