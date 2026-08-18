import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, MessageCircle, Check, Ban } from 'lucide-react';

export default function ProductCard({ product, compact = false }) {
  const {
    cart,
    wishlist,
    addToCart,
    toggleWishlist,
    setSelectedProductDetail,
    STORE_INFO,
    t,
    isArabic
  } = useStore();

  const [imgError, setImgError] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const isInStock = product.inStock !== false;

  const displayName = isArabic ? (product.arabicName || product.name) : product.name;

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const waLink = isInStock
    ? `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
        isArabic
          ? `مرحباً أليف بيتس، أريد طلب: ${displayName} — ${product.price} ج.م`
          : `Hello Aleef Pets, I would like to order: ${displayName} — ${product.price} EGP`
      )}`
    : `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
        isArabic
          ? `مرحباً أليف بيتس، متى سيتوفر منتج: ${displayName}؟`
          : `Hello Aleef Pets, when will this item restock: ${displayName}?`
      )}`;

  return (
    <article className="product-card bg-white rounded-2xl overflow-hidden border border-slate-100/80 flex flex-col group shadow-sm">

      {/* ── Image ── */}
      <div
        className="relative overflow-hidden bg-slate-50 cursor-pointer shrink-0"
        style={{ aspectRatio: compact ? '1/1' : '4/3' }}
        onClick={() => setSelectedProductDetail(product)}
        aria-label={`View details of ${displayName}`}
      >
        <img
          src={imgError
            ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
            : product.image}
          alt={displayName}
          onError={() => setImgError(true)}
          className={`product-img w-full h-full object-cover ${!isInStock ? 'grayscale opacity-75' : ''}`}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

        {/* Out of stock badge */}
        {!isInStock && (
          <div className={`absolute top-2.5 ${isArabic ? 'left-2.5' : 'left-2.5'} bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md leading-none flex items-center gap-1 z-10`}>
            <Ban className="w-3 h-3 text-red-400" />
            <span>{t('outOfStock')}</span>
          </div>
        )}

        {/* Discount badge */}
        {isInStock && discountPct > 0 && (
          <div className={`absolute top-2.5 ${isArabic ? 'left-2.5' : 'left-2.5'} bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow leading-none`}>
            -{discountPct}%
          </div>
        )}
        {isInStock && !discountPct && product.isBestSeller && (
          <div className={`absolute top-2.5 ${isArabic ? 'left-2.5' : 'left-2.5'} badge-bestseller text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow leading-none`}>
            {t('bestSellers')}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2 ${isArabic ? 'right-2' : 'right-2'} w-7 h-7 rounded-full flex items-center justify-center shadow transition-all ${
            isWishlisted
              ? 'bg-red-600 text-white scale-110'
              : 'bg-white/90 text-slate-400 hover:text-red-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* ── Info ── */}
      <div className={`p-3 sm:p-3.5 flex flex-col flex-1 gap-1.5 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>

        {/* Brand */}
        <span className="text-[10px] font-black text-red-600 uppercase tracking-wider leading-none">
          {product.brand}
        </span>

        {/* Name */}
        <h3
          onClick={() => setSelectedProductDetail(product)}
          className="text-[12px] sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
        >
          {displayName}
        </h3>

        {/* Weight + Rating */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-800">{product.rating || 5.0}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount || 1})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[70px]">{product.weight}</span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {product.price.toFixed(0)}
            <span className="text-[11px] font-bold text-slate-500 mx-0.5">{t('currency')}</span>
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-slate-400 line-through font-medium">
              {product.originalPrice.toFixed(0)} {t('currency')}
            </span>
          )}
        </div>

        {/* ── CTA row ── */}
        <div className="flex gap-2 mt-auto pt-1.5">
          {isInStock ? (
            <button
              onClick={() => addToCart(product, 1)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs sm:text-[13px] transition-all shadow-sm ${
                cartItem
                  ? 'bg-slate-900 text-emerald-400'
                  : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white'
              }`}
            >
              {cartItem ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('inCart')} ({cartItem.quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>{t('outOfStock')}</span>
            </button>
          )}

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title={isInStock ? t('orderWhatsApp') : t('askRestock')}
            className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all shadow-sm ${
              isInStock
                ? 'bg-[#25D366] hover:bg-[#22c35e] active:scale-95 text-white'
                : 'bg-slate-700 hover:bg-slate-800 text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

      </div>
    </article>
  );
}
