import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal, RotateCcw, ChevronDown, Flame, Tag } from 'lucide-react';

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
    t,
    isArabic
  } = useStore();

  const SORT_OPTIONS = [
    { value: 'featured',   label: t('sortFeatured')   },
    { value: 'price-asc',  label: t('sortPriceAsc')   },
    { value: 'price-desc', label: t('sortPriceDesc')  },
    { value: 'rating',     label: t('sortRating')     },
    { value: 'discount',   label: t('sortDiscount')   },
  ];

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
  else if (sortBy === 'rating') sorted.sort((a, b) => (b.rating || 5) - (a.rating || 5));
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
    <section id="products-section" className="w-full max-w-full overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Best Sellers spotlight ── */}
      {showHighlights && (
        <div className="bg-white pt-6 sm:pt-10 pb-5 sm:pb-6 border-b border-slate-100 w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900">{t('bestSellers')}</h2>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{t('bestSellersSub')}</p>
              </div>
              <button
                onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[11px] sm:text-xs font-black text-red-600 hover:text-red-800 transition-colors"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {bestSellers.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── All products ── */}
      <div id="all-products" className="bg-slate-50 py-6 sm:py-10 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">

          {/* Section header */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-4 h-4 text-red-600" />
                <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                  {hasActiveFilters ? t('searchResults') : t('allProducts')}
                </h2>
              </div>
              <div className="w-10 sm:w-12 h-0.5 bg-red-600 rounded-full" />
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                {t('resetFilters')}
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="w-full overflow-x-auto scrollbar-none py-1">
            <div className="flex gap-1.5 sm:gap-2 min-w-max">
              {CATEGORIES.map((cat) => {
                const label = isArabic ? cat.label : (cat.en || cat.label);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>
                <strong className="text-slate-900 font-black">{sorted.length}</strong> {t('itemsCount')}
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none bg-white border border-slate-200 rounded-xl ${isArabic ? 'pr-3 pl-7' : 'pl-3 pr-7'} py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer shadow-xs`}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className={`absolute ${isArabic ? 'left-2' : 'right-2'} top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none`} />
            </div>
          </div>

          {/* Grid */}
          {sorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-100 space-y-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">{t('noProductsFound')}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{t('noProductsSub')}</p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                {t('showAllProducts')}
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
