import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal, RotateCcw, ChevronDown, Flame, Tag } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'الأكثر مبيعاً'          },
  { value: 'price-asc',  label: 'السعر: من الأقل'         },
  { value: 'price-desc', label: 'السعر: من الأعلى'        },
  { value: 'rating',     label: 'الأعلى تقييماً'           },
  { value: 'discount',   label: 'الأعلى خصماً'            },
];

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

  // Filter
  let filtered = PRODUCTS.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hit =
        (p.arabicName || '').toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (selectedSpecies !== 'all' && p.species !== selectedSpecies) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered];
  if (sortBy === 'price-asc')  sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'discount') sorted.sort((a, b) => {
    const da = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
    const db = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
    return db - da;
  });
  else sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecies('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedSpecies !== 'all' || selectedCategory !== 'all';

  // Best sellers for highlights
  const bestSellers = sorted.filter(p => p.isBestSeller);
  const showHighlights = !hasActiveFilters && sortBy === 'featured' && bestSellers.length > 0;

  return (
    <section id="products-section" dir="rtl">

      {/* ── Best Sellers spotlight ── */}
      {showHighlights && (
        <div className="bg-white pt-10 pb-6 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">الأكثر مبيعاً</h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">المنتجات الأعلى طلباً من عملائنا</p>
              </div>
              <button
                onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-black text-red-600 hover:text-red-800 transition-colors hidden sm:block"
              >
                عرض الكل
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {bestSellers.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── All products ── */}
      <div id="all-products" className="bg-slate-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          {/* Section header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-red-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {hasActiveFilters ? 'نتائج البحث' : 'جميع المنتجات'}
                </h2>
              </div>
              <div className="w-12 h-0.5 bg-red-600 rounded-full" />
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
            <div className="flex gap-2 min-w-max pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>
                <strong className="text-slate-900 font-black">{sorted.length}</strong> منتج
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pr-4 pl-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer shadow-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Grid */}
          {sorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">لا توجد منتجات مطابقة</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">جرب تعديل البحث أو إعادة ضبط الفلاتر</p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                إظهار جميع المنتجات
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
