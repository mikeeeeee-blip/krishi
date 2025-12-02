'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
  name: string;
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

  // Debug: Log hover state changes
  useEffect(() => {
    if (hoveredCategory) {
      console.log('Dropdown should be visible for:', hoveredCategory);
    }
  }, [hoveredCategory]);

  return (
    <nav className="bg-[#16a34a] text-white shadow-md relative" style={{ zIndex: 100 }}>
      <div className="container mx-auto px-4" style={{ position: 'relative', overflow: 'visible' }}>
        <div 
          className="flex items-center gap-0.5 md:gap-1"
          style={{ 
            overflowX: 'auto',
            overflowY: 'visible',
            position: 'relative',
          }}
        >
          {categories.map((category) => {
            const isHovered = hoveredCategory === category.name;
            const hasItems = category.items && category.items.length > 0;
            
            return (
              <div
                key={category.name}
                className="relative flex-shrink-0"
                style={{ 
                  zIndex: isHovered ? 1000 : 'auto',
                }}
                onMouseEnter={() => {
                  if (hasItems) {
                    setHoveredCategory(category.name);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                }}
              >
                <button 
                  type="button"
                  className={`px-3 md:px-4 py-2.5 md:py-3 transition-colors flex items-center gap-1 whitespace-nowrap text-sm md:text-base font-medium ${
                    isHovered ? 'bg-[#15803d]' : 'hover:bg-[#15803d]'
                  }`}
                >
                  <span>{category.name}</span>
                  {hasItems && (
                    isHovered ? (
                      <ChevronUp size={14} className="md:w-4 md:h-4" />
                    ) : (
                      <ChevronDown size={14} className="md:w-4 md:h-4" />
                    )
                  )}
                </button>

                {/* Dropdown Menu */}
                {isHovered && hasItems && (
                  <div 
                    className="bg-white text-gray-900 shadow-xl min-w-[280px] max-w-[350px] max-h-[500px] overflow-y-auto border border-gray-300"
                    style={{ 
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 99999,
                      marginTop: '0px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredCategory(category.name);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredCategory(null);
                    }}
                  >
                    <div className="py-1">
                      {category.items!.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition-colors text-sm text-gray-800"
                          onClick={(e) => e.preventDefault()}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
