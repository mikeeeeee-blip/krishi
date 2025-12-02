'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateDropdownPosition = () => {
    if (hoveredCategory && buttonRefs.current[hoveredCategory]) {
      const button = buttonRefs.current[hoveredCategory];
      if (button) {
        const rect = button.getBoundingClientRect();
        
        // Get viewport-relative position (for fixed positioning)
        // Position dropdown directly below the button, aligned with left edge
        let left = rect.left;
        let top = rect.bottom;
        
        // Add a tiny gap to prevent any visual overlap
        top += 1;
        
        // Calculate dropdown width (responsive)
        const dropdownWidth = Math.min(600, window.innerWidth - 32);
        
        // Start with button's left edge
        let finalLeft = left;
        
        // Ensure dropdown doesn't go off-screen on the right
        if (finalLeft + dropdownWidth > window.innerWidth - 16) {
          // Shift left so it fits on screen
          finalLeft = window.innerWidth - dropdownWidth - 16;
        }
        
        // Ensure dropdown doesn't go off-screen on the left
        if (finalLeft < 16) {
          finalLeft = 16;
        }
        
        setDropdownPosition({
          top: top,
          left: finalLeft,
          width: dropdownWidth,
        });
      }
    }
  };

  useEffect(() => {
    updateDropdownPosition();
    
    if (hoveredCategory) {
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      // Also listen to nav container scroll
      const navContainer = navScrollRef.current;
      if (navContainer) {
        navContainer.addEventListener('scroll', handleScroll, true);
      }
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
        if (navContainer) {
          navContainer.removeEventListener('scroll', handleScroll, true);
        }
      };
    } else {
      setDropdownPosition(null);
    }
  }, [hoveredCategory]);

  const currentCategory = categories.find(cat => cat.name === hoveredCategory);
  const hasItems = currentCategory?.items && currentCategory.items.length > 0;

  const DropdownContent = () => {
    if (!hoveredCategory || !hasItems || !dropdownPosition) return null;

    return (
      <div 
        className="bg-white text-gray-900 shadow-xl border border-gray-300"
        style={{ 
          position: 'fixed',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 999999,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setHoveredCategory(hoveredCategory);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setHoveredCategory(null);
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Category items in two columns */}
          <div className="flex-1 p-4 md:p-6 min-w-0 md:min-w-[400px]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
              {currentCategory!.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1">
              {currentCategory!.items!.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block py-1.5 md:py-2 hover:text-green-600 transition-colors text-xs sm:text-sm md:text-base text-gray-700 hover:font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Placeholder message */}
          <div className="hidden md:flex items-center justify-center p-6 lg:p-8 border-t md:border-t-0 md:border-l border-gray-200 min-w-[200px] lg:min-w-[250px] bg-gray-50">
            <div className="text-center">
              <div className="mb-3 md:mb-4 flex justify-center">
                <svg 
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-sm md:text-base mb-2">
                Hover over a category to see subcategories
              </p>
              <p className="text-gray-500 text-xs md:text-sm">
                Browse through our extensive product range
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-[#16a34a] text-white shadow-md relative w-full" style={{ zIndex: 1000, overflow: 'hidden', maxHeight: '48px', height: '48px' }}>
        <div className="w-full" style={{ position: 'relative', overflow: 'hidden', maxHeight: '48px', height: '48px' }}>
          <div 
            ref={navScrollRef}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 scrollbar-hide"
            style={{ 
              overflowX: 'auto',
              overflowY: 'hidden',
              position: 'relative',
              WebkitOverflowScrolling: 'touch',
              flexWrap: 'nowrap',
              minHeight: '48px',
              maxHeight: '48px',
            }}
          >
            {categories.map((category) => {
              const isHovered = hoveredCategory === category.name;
              const hasItems = category.items && category.items.length > 0;
              
              return (
                <div
                  key={category.name}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    if (hasItems) {
                      setHoveredCategory(category.name);
                    }
                  }}
                  onMouseLeave={() => {
                    // Small delay to allow moving to dropdown
                    timeoutRef.current = setTimeout(() => {
                      if (hoveredCategory === category.name) {
                        setHoveredCategory(null);
                      }
                    }, 100);
                  }}
                >
                  <button 
                    ref={(el) => (buttonRefs.current[category.name] = el)}
                    type="button"
                    className={`px-3 md:px-4 py-2 md:py-2.5 transition-colors flex items-center gap-1 whitespace-nowrap text-sm md:text-base font-medium h-full ${
                      isHovered ? 'bg-[#15803d]' : 'hover:bg-[#15803d]'
                    }`}
                    style={{ height: '100%' }}
                  >
                    <span>{category.name}</span>
                    {hasItems && (
                      isHovered ? (
                        <ChevronUp size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                      )
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Render dropdown outside navbar using portal */}
      {mounted && hoveredCategory && hasItems && typeof window !== 'undefined' && createPortal(
        <DropdownContent />,
        document.body
      )}
    </>
  );
}
