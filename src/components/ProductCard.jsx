import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, MessageCircle, Check, Plus } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductCard({ product }) {
  const {
    cart,
    wishlist,
    addToCart,
    toggleWishlist,
    setSelectedProductDetail
  } = useStore();

  const [imgError, setImgError] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const waLink = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
    `مرحباً أليف بيتس، أريد طلب: ${product.arabicName || product.name} — السعر: ${product.price} ج.م`
  )}`;

  return (
    <article className="product-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col group">

      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden bg-slate-50 cursor-pointer"
        style={{ aspectRatio: '4/3' }}
        onClick={() => setSelectedProductDetail(product)}
      >
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' : product.image}
          alt={product.arabicName || product.name}
          onError={() => setImgError(true)}
          className="product-img w-full h-full object-cover"
          loading="lazy"
        />

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            isWishlisted ? 'bg-red-600 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Discount badge */}
        {discountPct > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm leading-none">
            -{discountPct}%
          </div>
        )}
        {product.discountBadge && !discountPct && (
          <div className={`absolute top-2.5 left-2.5 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm leading-none ${
            product.isBestSeller ? 'badge-bestseller' : 'bg-slate-800'
          }`}>
            {product.discountBadge}
          </div>
        )}
      </div>

      {/* ── Info area ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 text-right" dir="rtl">

        {/* Brand */}
        <span className="text-[10px] sm:text-[11px] font-bold text-red-600 uppercase tracking-wide leading-none">
          {product.brand}
        </span>

        {/* Name */}
        <h3
          onClick={() => setSelectedProductDetail(product)}
          className="text-[13px] sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
        >
          {product.arabicName || product.name}
        </h3>

        {/* Rating + weight */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{product.weight}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {product.price.toFixed(0)} {STORE_INFO.currencySymbol}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              {product.originalPrice.toFixed(0)} {STORE_INFO.currencySymbol}
            </span>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 mt-1">

          {/* Add to Cart — large, full-width */}
          <button
            onClick={() => addToCart(product, 1)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all shadow-sm ${
              cartItem
                ? 'bg-slate-900 text-emerald-400'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
            }`}
          >
            {cartItem ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>في السلة ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

          {/* WhatsApp icon button */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="اطلب عبر الواتساب"
            className="btn-whatsapp flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl shrink-0 transition-all shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>

      </div>
    </article>
  );
}
