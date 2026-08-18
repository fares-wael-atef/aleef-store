import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, MessageCircle, Heart, Check, Ban } from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    selectedProductDetail, 
    setSelectedProductDetail, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    STORE_INFO,
    t,
    isArabic
  } = useStore();

  const [qty, setQty] = useState(1);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isWishlisted = wishlist.includes(product.id);
  const isInStock = product.inStock !== false;
  const displayName = isArabic ? (product.arabicName || product.name) : product.name;

  const whatsappInquiryLink = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
    isArabic
      ? `السلام عليكم أليف بيتس! 👋 لدي استفسار عن منتج: ${displayName} بسعر ${product.price} ج.م`
      : `Hello Aleef Pets! I have an inquiry about: ${displayName} (${product.price} EGP)`
  )}`;

  const handleAddToCart = () => {
    if (!isInStock) return;
    addToCart(product, qty);
    setSelectedProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-red-100 relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} z-20 w-8 h-8 rounded-full bg-white/90 shadow-md hover:bg-red-50 flex items-center justify-center font-bold text-slate-800 transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Image Column */}
            <div className="md:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-red-100 bg-red-50/30 h-60 p-2 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`mt-3 w-full py-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                <span>{isWishlisted ? (isArabic ? 'محفوظ بالمفضلة' : 'In Wishlist') : (isArabic ? 'إضافة للمفضلة' : 'Add to Wishlist')}</span>
              </button>
            </div>

            {/* Info Column */}
            <div className={`md:col-span-7 flex flex-col justify-between space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {product.brand}
                  </span>
                  {isInStock ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {t('inStock')}
                    </span>
                  ) : (
                    <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Ban className="w-3 h-3 text-red-400" />
                      <span>{t('outOfStock')}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-2 leading-tight">
                  {displayName}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 5.0}</span>
                  </div>
                  <span>•</span>
                  <span>{product.weight}</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-black text-red-600">
                    {product.price.toFixed(0)} {t('currency')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {product.originalPrice.toFixed(0)} {t('currency')}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isInStock ? (
                  <div className="flex gap-2">
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 text-xs font-black font-mono">{qty}</span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('addToCart')}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl border border-slate-200 cursor-not-allowed"
                  >
                    {t('outOfStock')}
                  </button>
                )}

                <a
                  href={whatsappInquiryLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isInStock ? t('orderWhatsApp') : t('askRestock')}</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
