import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Search, ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function MobileBottomNav() {
  const { 
    totalItemsCount, 
    wishlist, 
    setIsCartOpen, 
    setSelectedSpecies,
    setSearchQuery 
  } = useStore();

  const scrollToProducts = (species = 'all') => {
    setSelectedSpecies(species);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-red-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5" dir="rtl">
      <div className="flex items-center justify-around text-center">
        
        {/* Home */}
        <button
          onClick={() => {
            setSelectedSpecies('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-red-600 active:scale-95 transition-all min-w-[56px]"
        >
          <Home className="w-5 h-5 text-slate-800" />
          <span className="text-[10px] font-bold mt-0.5">الرئيسية</span>
        </button>

        {/* Species / Search */}
        <button
          onClick={() => scrollToProducts('all')}
          className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-red-600 active:scale-95 transition-all min-w-[56px]"
        >
          <Search className="w-5 h-5 text-slate-800" />
          <span className="text-[10px] font-bold mt-0.5">المنتجات</span>
        </button>

        {/* Floating WhatsApp in center */}
        <a
          href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس!%20أريد%20الطلب%20والاستفسار`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center -mt-5 bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-500/40 border-2 border-white active:scale-90 transition-transform"
          title="واتساب أليف بيتس"
        >
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
        </a>

        {/* Wishlist */}
        <button
          onClick={() => {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-red-600 active:scale-95 transition-all min-w-[56px]"
        >
          <Heart className="w-5 h-5 text-slate-800" />
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-3.5 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-bold mt-0.5">المفضلة</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-red-600 active:scale-95 transition-all min-w-[56px]"
        >
          <ShoppingBag className="w-5 h-5 text-slate-800" />
          {totalItemsCount > 0 && (
            <span className="absolute top-1 right-3.5 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow">
              {totalItemsCount}
            </span>
          )}
          <span className="text-[10px] font-bold mt-0.5">السلة</span>
        </button>

      </div>
    </div>
  );
}
