import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, MessageCircle, Eye, Check } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductCard({ product }) {
  const { 
    cart, 
    wishlist, 
    addToCart, 
    toggleWishlist, 
    setSelectedProductDetail
  } = useStore();

  const [imgSrc, setImgSrc] = useState(product.image);

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);

  // Direct WhatsApp order link with Arabic pre-filled message (using Aleef Pets)
  const whatsappSingleLink = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
    `السلام عليكم أليف بيتس! 👋 أريد طلب: ${product.arabicName || product.name} بسعر ${product.price} ج.م`
  )}`;

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col overflow-hidden shadow-sm">
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col space-y-1">
        {product.discountBadge ? (
          <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-sm">
            {product.discountBadge}
          </span>
        ) : product.isBestSeller ? (
          <span className="bg-slate-950 text-white font-black text-[9px] sm:text-[10px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-sm">
            الأكثر مبيعاً 🔥
          </span>
        ) : null}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
          isWishlisted
            ? 'bg-red-600 text-white shadow-md'
            : 'bg-white/85 text-slate-400 hover:text-red-600 hover:bg-white shadow-sm'
        }`}
        title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
      </button>

      {/* Product Image */}
      <div 
        onClick={() => setSelectedProductDetail(product)}
        className="relative h-36 sm:h-52 overflow-hidden bg-red-50/20 cursor-pointer flex items-center justify-center p-2"
      >
        <img
          src={imgSrc}
          alt={product.arabicName || product.name}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80')}
          className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="hidden sm:flex absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <span className="bg-white text-slate-900 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 rtl:space-x-reverse transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            <span>نظرة سريعة</span>
          </span>
        </div>
      </div>

      {/* Card Content (Arabic First) */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 text-right" dir="rtl">
        <div>
          {/* Brand & Weight */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-slate-400 mb-0.5 sm:mb-1">
            <span className="text-red-600 font-black">{product.brand}</span>
            <span>{product.weight}</span>
          </div>

          {/* Product Arabic Title */}
          <h3 
            onClick={() => setSelectedProductDetail(product)}
            className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-red-600 transition-colors cursor-pointer leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.arabicName || product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-slate-800">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price Tag */}
        <div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-sm sm:text-lg font-black text-red-600">
              {product.price.toFixed(2)} {STORE_INFO.currencySymbol}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {product.originalPrice.toFixed(2)} {STORE_INFO.currencySymbol}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: WhatsApp Order button + Add to Cart */}
        <div className="pt-2 border-t border-red-50 flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* WhatsApp Order Button */}
          <a
            href={whatsappSingleLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs flex items-center justify-center space-x-1 rtl:space-x-reverse shadow-sm transition-colors active:scale-95"
            title="طلب عبر الواتساب"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
            <span className="truncate">واتساب</span>
          </a>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center transition-all shrink-0 ${
              cartItem
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-95'
            }`}
            title={cartItem ? `في السلة (${cartItem.quantity})` : 'إضافة إلى السلة'}
          >
            {cartItem ? (
              <span className="flex items-center space-x-0.5 rtl:space-x-reverse">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px] font-black">{cartItem.quantity}</span>
              </span>
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
