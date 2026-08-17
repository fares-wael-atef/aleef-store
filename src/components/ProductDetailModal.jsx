import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, MessageCircle, Heart, Check } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductDetailModal() {
  const { selectedProductDetail, setSelectedProductDetail, addToCart, toggleWishlist, wishlist } = useStore();

  const [qty, setQty] = useState(1);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isWishlisted = wishlist.includes(product.id);

  const whatsappInquiryLink = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
    `السلام عليكم أليف بيتس! 👋 لدي استفسار عن منتج: ${product.arabicName || product.name} بسعر ${product.price} ج.م`
  )}`;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setSelectedProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-red-100 relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md hover:bg-red-50 flex items-center justify-center font-bold text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Image Column */}
            <div className="md:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-red-100 bg-red-50/30 h-64 p-2 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.arabicName || product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`mt-3 w-full py-2.5 rounded-xl border text-xs font-black flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all ${
                  isWishlisted
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                <span>{isWishlisted ? 'محفوظ في المفضلة' : 'إضافة للمفضلة'}</span>
              </button>
            </div>

            {/* Info Column */}
            <div className="md:col-span-7 space-y-4 text-right">
              <div>
                <span className="text-xs font-black text-red-600 uppercase tracking-wide">
                  {product.brand}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 leading-snug mt-0.5">
                  {product.arabicName || product.name}
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  {product.name}
                </p>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs">
                <div className="flex items-center space-x-1 rtl:space-x-reverse bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-600">{product.reviewsCount} تقييم</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 font-black flex items-center space-x-1 rtl:space-x-reverse">
                  <Check className="w-3.5 h-3.5" />
                  <span>متوفر بالمخزن ({product.stockQty} قطعة)</span>
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl font-black text-red-600">
                  {product.price.toFixed(2)} {STORE_INFO.currencySymbol}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.originalPrice.toFixed(2)} {STORE_INFO.currencySymbol}
                  </span>
                )}
                <span className="bg-red-100 text-red-900 text-xs font-black px-2.5 py-1 rounded-md">
                  حجم العبوة: {product.weight}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                {product.description}
              </p>

              {/* Dietary Tags */}
              {product.dietary && product.dietary.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-slate-400 uppercase">مميزات المنتج</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.dietary.map((tag, idx) => (
                      <span key={idx} className="bg-red-50 text-red-900 border border-red-200 text-xs font-black px-2.5 py-1 rounded-lg">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add Button */}
              <div className="pt-2 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="flex items-center border border-red-200 rounded-xl bg-red-50/40">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 font-black text-slate-700 hover:bg-red-100 rounded-r-xl flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm text-slate-950">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 font-black text-slate-700 hover:bg-red-100 rounded-l-xl flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة للسلة • {(product.price * qty).toFixed(2)} ج.م</span>
                </button>
              </div>

              {/* Instant WhatsApp Inquiry Button */}
              <a
                href={whatsappInquiryLink}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black py-2.5 rounded-xl border border-emerald-300 flex items-center justify-center space-x-2 rtl:space-x-reverse text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>استفسر عن المنتج عبر الواتساب</span>
              </a>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
