import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { SPECIES_LIST, CATEGORIES, STORE_INFO } from '../data/products';
import { ArrowUpDown, RotateCcw, Sparkles } from 'lucide-react';

export default function ProductGrid() {
  const {
    PRODUCTS,
    searchQuery,
    setSearchQuery,
    selectedSpecies,
    setSelectedSpecies,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useStore();

  const [dietaryFilter, setDietaryFilter] = useState('all');

  // Filter pipeline
  let filtered = PRODUCTS.filter((product) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (product.arabicName || '').toLowerCase().includes(q) || product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory && !matchDesc) return false;
    }

    // Species filter
    if (selectedSpecies !== 'all' && product.species !== selectedSpecies) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Dietary tag filter
    if (dietaryFilter !== 'all') {
      if (!product.dietary || !product.dietary.some(d => d.toLowerCase().includes(dietaryFilter.toLowerCase()))) {
        return false;
      }
    }

    return true;
  });

  // Sorting pipeline
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecies('all');
    setSelectedCategory('all');
    setDietaryFilter('all');
    setSortBy('featured');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Section Headline */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide">
          المنتجات المتميزة • FEATURED PRODUCTS
        </h2>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
      </div>

      {/* Category Pills Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-none" dir="rtl">
        <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-white text-slate-700 hover:bg-red-50 border border-red-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Dietary Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-100 pb-4" dir="rtl">
        
        {/* Results summary & Sort Dropdown */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-xs font-bold text-slate-500">
            عرض <strong className="text-red-600">{filtered.length}</strong> منتج
          </span>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-red-100 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="featured">الأحدث والشائع</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً ⭐</option>
            </select>
          </div>
        </div>

        {/* Active Filter Reset */}
        {(searchQuery || selectedSpecies !== 'all' || selectedCategory !== 'all' || dietaryFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-red-600 hover:text-red-800 font-black flex items-center space-x-1 rtl:space-x-reverse underline text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid (2 columns on mobile, 3 on tablet, 4 on desktop) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-red-100 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-3xl">
            🐾
          </div>
          <h3 className="text-lg font-black text-slate-900">لا توجد منتجات مطابقة لفلترك</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرب البحث باسم آخر أو إزالة بعض خيارات التصفية.
          </p>
          <button
            onClick={resetFilters}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl shadow-md transition-all text-xs"
          >
            إعادة التصفية
          </button>
        </div>
      )}

    </section>
  );
}
