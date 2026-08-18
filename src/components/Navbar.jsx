import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, MessageCircle, X } from 'lucide-react';
import { STORE_INFO, SPECIES_LIST } from '../data/products';

export default function Navbar() {
  const {
    wishlist,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    selectedSpecies,
    setSelectedSpecies,
    totalItemsCount
  } = useStore();

  return (
    <header className="sticky top-0 z-40 shadow-sm" dir="rtl">

      {/* ── Top announcement bar ── */}
      <div className="bg-slate-950 text-white text-center py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide hidden sm:block">
        شحن مجاني عند الطلب فوق 500 ج.م &nbsp;·&nbsp; اطلب الآن عبر واتساب &nbsp;·&nbsp; توصيل لجميع محافظات مصر
      </div>

      {/* ── Main header ── */}
      <div className="bg-[#DC2626]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-5">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white transition-transform duration-300 group-hover:scale-105">
                <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
                <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
                <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
                <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
                <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
              </svg>
            </div>
            <div className="w-px h-9 bg-white/30 shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-[1.5rem] sm:text-[1.75rem] font-black text-white tracking-tight leading-none">
                Aleef Pets
              </span>
              <span className="text-[0.72rem] font-semibold text-red-100 mt-0.5">
                أليف بيتس
              </span>
            </div>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج، ماركة، نوع طعام..."
                className="w-full pr-9 pl-9 py-2 sm:py-2.5 bg-white rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* WhatsApp — desktop only */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-mono">{STORE_INFO.phone1}</span>
            </a>

            {/* Wishlist */}
            <button className="relative p-2 text-white hover:bg-white/15 rounded-xl transition-colors">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-red-600 font-black text-[10px] rounded-full flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-white text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-black text-sm transition-all shadow"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 bg-red-600 text-white font-black text-[11px] rounded-full flex items-center justify-center leading-none shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Species tab bar ── */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto scrollbar-none shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-0 min-w-max">
          {SPECIES_LIST.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedSpecies(sp.id)}
              className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                selectedSpecies === sp.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              {sp.label}
              {sp.en && <span className="hidden sm:inline text-[10px] font-normal text-slate-400 mr-1">/ {sp.en}</span>}
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}
