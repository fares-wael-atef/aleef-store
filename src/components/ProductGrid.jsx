import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',    label: 'الأكثر مبيعاً'         },
  { value: 'price-asc',   label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc',  label: 'السعر: من الأعلى للأقل' },
  { value: 'rating',      label: 'الأعلى تقييماً'          },
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
        p.description.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (selectedSpecies !== 'all' && p.species !== selectedSpecies) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  // Sort
  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating')     filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  // featured: best sellers first
  if (sortBy === 'featured')   filtered = [...filtered].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecies('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedSpecies !== 'all' || selectedCategory !== 'all';

  return (
    <section id="products-section" className="bg-slate-50 py-8 sm:py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              منتجاتنا المميزة
            </h2>
            <div className="section-rule mt-2" />
          </div>
          <span className="text-xs text-slate-500 font-medium shrink-0">
            {filtered.length} منتج
          </span>
        </div>

        {/* ── Category pills ── */}
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
          <div className="flex gap-2 min-w-max pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>
              عرض <strong className="text-slate-800 font-black">{filtered.length}</strong> منتج
              {hasActiveFilters && ' (مع فلاتر نشطة)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط
              </button>
            )}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pr-3 pl-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-slate-800">لا توجد منتجات مطابقة</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              جرب تعديل كلمة البحث أو إعادة ضبط الفلاتر للعرض الكامل.
            </p>
            <button
              onClick={resetFilters}
              className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              إظهار جميع المنتجات
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

// Fix missing import
function ShoppingBag({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
