import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Search, ShoppingBag, Heart, Shield } from 'lucide-react';

export default function MobileBottomNav() {
  const { 
    totalItemsCount, 
    wishlist, 
    setIsCartOpen, 
    setSelectedSpecies,
    setSearchQuery,
    navigateToView,
    currentView,
    unreadOrdersCount
  } = useStore();

  const scrollToProducts = (species = 'all') => {
    navigateToView('store');
    setSelectedSpecies(species);
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 font-sans" dir="rtl">
      <div className="flex items-center justify-around text-center">
        
        {/* Home */}
        <button
          onClick={() => {
            navigateToView('store');
            setSelectedSpecies('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-1.5 transition-all min-w-[56px] ${
            currentView === 'store' ? 'text-red-600 font-black' : 'text-slate-700'
          }`}
        >
          <Home className="w-5 h-5" />
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

        {/* Cart in center */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center -mt-5 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full shadow-lg shadow-red-600/40 border-2 border-white active:scale-90 transition-transform"
          title="سلة التسوق"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
          {totalItemsCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-slate-950 text-white font-black text-[10px] rounded-full flex items-center justify-center border border-white">
              {totalItemsCount}
            </span>
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            navigateToView('store');
            setTimeout(() => {
              const el = document.getElementById('products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
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

        {/* Admin Link */}
        <button
          onClick={() => navigateToView('admin')}
          className={`relative flex flex-col items-center justify-center p-1.5 transition-all min-w-[56px] ${
            currentView === 'admin' ? 'text-red-600 font-black' : 'text-slate-700'
          }`}
        >
          <Shield className="w-5 h-5" />
          {unreadOrdersCount > 0 && (
            <span className="absolute top-1 right-3.5 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
              {unreadOrdersCount}
            </span>
          )}
          <span className="text-[10px] font-bold mt-0.5">الإدارة</span>
        </button>

      </div>
    </div>
  );
}
