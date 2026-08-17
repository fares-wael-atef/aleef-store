import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingBag, 
  Heart,
  Phone,
  MessageCircle
} from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white shadow-md">
      
      {/* Main Red Top Header Bar */}
      <div className="bg-[#DC2626] px-4 py-3 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo Branding (Paw Vector | Divider | Big "Aleef Pets" | Small "أليف بيتس") */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            {/* High Precision Paw Icon in Crisp White */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-11 h-11 sm:w-12 sm:h-12 fill-white drop-shadow-md transition-transform group-hover:scale-105">
                {/* Main wide metacarpal pad */}
                <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
                {/* 4 angled oval toe pads */}
                <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
                <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
                <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
                <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
              </svg>
            </div>

            {/* Vertical Divider Line */}
            <div className="h-10 w-[2px] bg-white/40 shrink-0 rounded-full" />

            {/* Brand Title: BIG English "Aleef Pets" + Small Arabic "أليف بيتس" */}
            <div className="flex flex-col leading-none">
              <span className="text-[1.65rem] sm:text-[1.95rem] font-black text-white tracking-tight leading-none font-sans drop-shadow-sm">
                Aleef Pets
              </span>
              <span className="text-[0.75rem] sm:text-[0.85rem] font-bold text-red-100 mt-0.5 tracking-wide">
                أليف بيتس
              </span>
            </div>
          </a>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طعام قطط، كلاب، رمل، ألعاب..."
                className="w-full pl-4 pr-10 py-2 bg-white border-2 border-white/80 rounded-full text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-inner"
                dir="rtl"
              />
              <button 
                type="button"
                className="absolute left-2 text-red-600 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-800 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons (Direct WhatsApp numbers, Wishlist, Cart) */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 rtl:space-x-reverse shrink-0">
            
            {/* Direct WhatsApp Pill (with numbers 01110450247 / 01065041554) */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس!`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse bg-white/15 hover:bg-white/25 text-white border border-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              title="تواصل معنا عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span className="dir-ltr font-mono text-[11px] font-black tracking-tight">{STORE_INFO.phone1}</span>
            </a>

            {/* Wishlist */}
            <button 
              className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-600 font-black text-[10px] rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="سلة التسوق"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 font-black text-[11px] rounded-full flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Header Horizontal Species Category Bar */}
      <div className="bg-white border-b border-red-100 py-2 px-4 shadow-sm overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 rtl:space-x-reverse min-w-max text-xs sm:text-sm font-bold text-slate-800">
          {SPECIES_LIST.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedSpecies(sp.id)}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-1.5 rounded-full transition-all ${
                selectedSpecies === sp.id
                  ? 'bg-red-600 text-white font-black shadow-sm shadow-red-600/20'
                  : 'hover:bg-red-50 text-slate-700'
              }`}
            >
              <span>{sp.emoji}</span>
              <span>{sp.label}</span>
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}
