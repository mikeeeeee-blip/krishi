'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { getProductById, updateProduct } from '@/lib/api/products';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface KeyFeature {
  title: string | null;
  description: string;
}

interface Variant {
  _id?: string;
  name: string;
  quantity: string;
  price: number | null;
  stockQuantity: number;
  inStock: boolean | null;
  isBestSeller: boolean | null;
  isActive: boolean;
}

interface Dosage {
  spraying: string;
  sugarcane: string;
  soilApplication: string;
}

interface TechnicalDetails {
  brand: string;
  productCode: string;
  countryOfOrigin: string;
  category: string;
  subCategory: string;
  pickupAddress: string;
  addressOfOrigin: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'pricing']));
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    shortDescription: '',
    description: '',
    brandName: '',
    category: '',
    
    // Pricing
    originalPrice: 0,
    currentPrice: 0,
    costPrice: 0,
    discount: 0,
    discountPercent: 0,
    pricePerUnit: '',
    taxRate: 18.00,
    hsnCode: '',
    
    // Inventory
    stockQuantity: 0,
    lowStockThreshold: 10,
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED',
    
    // Flags
    isFeatured: false,
    isBestSeller: null as boolean | null,
    isNewArrival: false,
    freeDelivery: null as boolean | null,
    
    // Media
    images: [] as string[],
    videos: [] as string[],
    
    // Technical
    technicalComposition: '',
    keyFeatures: [] as KeyFeature[],
    safetyTips: [] as string[],
    suitableCrops: '',
    dosage: {
      spraying: '',
      sugarcane: '',
      soilApplication: ''
    } as Dosage,
    note: '',
    technicalDetails: {
      brand: '',
      productCode: '',
      countryOfOrigin: 'India',
      category: '',
      subCategory: '',
      pickupAddress: '',
      addressOfOrigin: ''
    } as TechnicalDetails,
    phoneNumber: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    searchKeywords: [] as string[],
    tags: [] as string[],
    
    // Variants
    variants: [] as Variant[],
  });

  useEffect(() => {
    if (productId && typeof productId === 'string' && productId.trim()) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId || typeof productId !== 'string' || !productId.trim()) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getProductById(productId);
      if (response.success && response.data) {
        const product = response.data;
        
        // Handle brand (can be object or string)
        let brandName = '';
        if (product.brandName) {
          brandName = product.brandName;
        } else if (product.brand) {
          if (typeof product.brand === 'object' && product.brand.name) {
            brandName = product.brand.name;
          } else if (typeof product.brand === 'string') {
            brandName = product.brand;
          }
        }

        // Handle category (can be object or string)
        let categoryId = '';
        if (product.category) {
          if (typeof product.category === 'object' && product.category._id) {
            categoryId = product.category._id;
          } else if (typeof product.category === 'string') {
            categoryId = product.category;
          }
        }

        // Handle variants - include all variants, not just active ones for editing
        const variants = (product.variants || []).map((v: any) => ({
          _id: v._id?.toString() || undefined,
          name: v.name || '',
          quantity: v.quantity || '',
          price: v.price !== undefined ? v.price : null,
          stockQuantity: v.stockQuantity || 0,
          inStock: v.inStock !== undefined ? v.inStock : null,
          isBestSeller: v.isBestSeller !== undefined ? v.isBestSeller : null,
          isActive: v.isActive !== undefined ? v.isActive : true,
        }));

        // Handle keyFeatures
        const keyFeatures = (product.keyFeatures || []).map((kf: any) => ({
          title: kf.title || null,
          description: kf.description || '',
        }));

        // Handle dosage
        const dosage = product.dosage || {
          spraying: '',
          sugarcane: '',
          soilApplication: ''
        };

        // Handle technicalDetails
        const technicalDetails = product.technicalDetails || {
          brand: '',
          productCode: '',
          countryOfOrigin: 'India',
          category: '',
          subCategory: '',
          pickupAddress: '',
          addressOfOrigin: ''
        };

        setFormData({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          brandName: brandName,
          category: categoryId,
          
          originalPrice: product.originalPrice || product.basePrice || 0,
          currentPrice: product.currentPrice || product.salePrice || 0,
          costPrice: product.costPrice || 0,
          discount: product.discount || 0,
          discountPercent: product.discountPercent || 0,
          pricePerUnit: product.pricePerUnit || '',
          taxRate: product.taxRate || 18.00,
          hsnCode: product.hsnCode || '',
          
          stockQuantity: product.stockQuantity || 0,
          lowStockThreshold: product.lowStockThreshold || 10,
          status: product.status || 'DRAFT',
          
          isFeatured: product.isFeatured || false,
          isBestSeller: product.isBestSeller !== undefined ? product.isBestSeller : (product.isBestseller !== undefined ? product.isBestseller : null),
          isNewArrival: product.isNewArrival || false,
          freeDelivery: product.freeDelivery !== undefined ? product.freeDelivery : null,
          
          images: product.images || [],
          videos: product.videos || [],
          
          technicalComposition: product.technicalComposition || '',
          keyFeatures: keyFeatures,
          safetyTips: product.safetyTips || [],
          suitableCrops: product.suitableCrops || '',
          dosage: dosage,
          note: product.note || '',
          technicalDetails: technicalDetails,
          phoneNumber: product.phoneNumber || '',
          
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          searchKeywords: product.searchKeywords || [],
          tags: product.tags || [],
          
          variants: variants,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load product';
      setError(errorMessage);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const addKeyFeature = () => {
    setFormData({
      ...formData,
      keyFeatures: [...formData.keyFeatures, { title: null, description: '' }]
    });
  };

  const updateKeyFeature = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.keyFeatures];
    updated[index] = { ...updated[index], [field]: value || null };
    setFormData({ ...formData, keyFeatures: updated });
  };

  const removeKeyFeature = (index: number) => {
    setFormData({
      ...formData,
      keyFeatures: formData.keyFeatures.filter((_, i) => i !== index)
    });
  };

  const addSafetyTip = () => {
    setFormData({
      ...formData,
      safetyTips: [...formData.safetyTips, '']
    });
  };

  const updateSafetyTip = (index: number, value: string) => {
    const updated = [...formData.safetyTips];
    updated[index] = value;
    setFormData({ ...formData, safetyTips: updated });
  };

  const removeSafetyTip = (index: number) => {
    setFormData({
      ...formData,
      safetyTips: formData.safetyTips.filter((_, i) => i !== index)
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, {
        name: '',
        quantity: '',
        price: null,
        stockQuantity: 0,
        inStock: null,
        isBestSeller: null,
        isActive: true
      }]
    });
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url]
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Calculate discount if not provided
      const discount = formData.discount || (formData.originalPrice - formData.currentPrice);
      const discountPercent = formData.discountPercent || 
        (formData.originalPrice > 0 ? Math.round((discount / formData.originalPrice) * 100) : 0);

      const productData = {
        ...formData,
        discount,
        discountPercent,
        basePrice: formData.originalPrice,
        salePrice: formData.currentPrice,
        isBestseller: formData.isBestSeller,
      };

      await updateProduct(productId, productData);
      setSuccess('Product updated successfully!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <span className="text-xl">{icon}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {expandedSections.has(id) ? (
        <ChevronUp className="text-gray-600" size={20} />
      ) : (
        <ChevronDown className="text-gray-600" size={20} />
      )}
    </button>
  );

  if (loading) {
    return (
      <AdminRouteGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-green-600" size={48} />
            <p className="text-gray-600 font-medium">Loading product...</p>
          </div>
        </div>
      </AdminRouteGuard>
    );
  }

  return (
    <AdminRouteGuard>
      <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
        <TopBar />
        <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
        <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X size={20} />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="flex-shrink-0" />
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 md:p-8 space-y-6">
            {/* Basic Information */}
            <div>
              <SectionHeader id="basic" title="Basic Information" icon="📝" />
              {expandedSections.has('basic') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div>
              <SectionHeader id="pricing" title="Pricing" icon="💰" />
              {expandedSections.has('pricing') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Original Price *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Current Price *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.currentPrice}
                        onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Cost Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">HSN Code</label>
                      <input
                        type="text"
                        value={formData.hsnCode}
                        onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Price Per Unit (e.g., ₹87.00 /100 gm)</label>
                    <input
                      type="text"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      placeholder="(₹87.00 /100 gm)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Inventory & Status */}
            <div>
              <SectionHeader id="inventory" title="Inventory & Status" icon="📦" />
              {expandedSections.has('inventory') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Low Stock Threshold</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                        <option value="DISCONTINUED">Discontinued</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller === true}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked ? true : null })}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNewArrival}
                        onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.freeDelivery === true}
                        onChange={(e) => setFormData({ ...formData, freeDelivery: e.target.checked ? true : null })}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Free Delivery</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <SectionHeader id="images" title="Product Images" icon="🖼️" />
              {expandedSections.has('images') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    type="button"
                    onClick={addImage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus size={18} />
                    Add Image URL
                  </button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/logo.png';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Details */}
            <div>
              <SectionHeader id="technical" title="Technical Information" icon="🔧" />
              {expandedSections.has('technical') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Technical Composition</label>
                    <input
                      type="text"
                      value={formData.technicalComposition}
                      onChange={(e) => setFormData({ ...formData, technicalComposition: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Suitable Crops</label>
                    <textarea
                      value={formData.suitableCrops}
                      onChange={(e) => setFormData({ ...formData, suitableCrops: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Note</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  
                  {/* Dosage */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Dosage Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Spraying</label>
                        <textarea
                          value={formData.dosage.spraying}
                          onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage, spraying: e.target.value } })}
                          rows={2}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Sugarcane</label>
                        <textarea
                          value={formData.dosage.sugarcane}
                          onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage, sugarcane: e.target.value } })}
                          rows={2}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Soil Application</label>
                        <textarea
                          value={formData.dosage.soilApplication}
                          onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage, soilApplication: e.target.value } })}
                          rows={2}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Product Code</label>
                        <input
                          type="text"
                          value={formData.technicalDetails.productCode}
                          onChange={(e) => setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, productCode: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Country of Origin</label>
                        <input
                          type="text"
                          value={formData.technicalDetails.countryOfOrigin}
                          onChange={(e) => setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, countryOfOrigin: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
                        <input
                          type="text"
                          value={formData.technicalDetails.category}
                          onChange={(e) => setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, category: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Sub Category</label>
                        <input
                          type="text"
                          value={formData.technicalDetails.subCategory}
                          onChange={(e) => setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, subCategory: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Key Features */}
            <div>
              <SectionHeader id="features" title="Key Features" icon="⭐" />
              {expandedSections.has('features') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    type="button"
                    onClick={addKeyFeature}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus size={18} />
                    Add Feature
                  </button>
                  {formData.keyFeatures.map((feature, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Feature {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeKeyFeature(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Title (Optional)</label>
                          <input
                            type="text"
                            value={feature.title || ''}
                            onChange={(e) => updateKeyFeature(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateKeyFeature(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div>
              <SectionHeader id="safety" title="Safety Tips" icon="⚠️" />
              {expandedSections.has('safety') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    type="button"
                    onClick={addSafetyTip}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus size={18} />
                    Add Safety Tip
                  </button>
                  {formData.safetyTips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => updateSafetyTip(index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeSafetyTip(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants */}
            <div>
              <SectionHeader id="variants" title="Product Variants" icon="📦" />
              {expandedSections.has('variants') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus size={18} />
                    Add Variant
                  </button>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1">Quantity</label>
                          <input
                            type="text"
                            value={variant.quantity}
                            onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1">Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price || ''}
                            onChange={(e) => updateVariant(index, 'price', e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            min="0"
                            value={variant.stockQuantity}
                            onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.inStock === true}
                            onChange={(e) => updateVariant(index, 'inStock', e.target.checked ? true : null)}
                            className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.isBestSeller === true}
                            onChange={(e) => updateVariant(index, 'isBestSeller', e.target.checked ? true : null)}
                            className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">Best Seller</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.isActive}
                            onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div>
              <SectionHeader id="seo" title="SEO & Metadata" icon="🔍" />
              {expandedSections.has('seo') && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Meta Description</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Update Product</span>
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </AdminRouteGuard>
  );
}
