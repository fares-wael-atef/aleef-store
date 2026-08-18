import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Check, 
  MessageCircle,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    isFreeShipping,
    STORE_INFO,
    t,
    isArabic
  } = useStore();

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    applyCoupon(couponCode);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = STORE_INFO.freeShippingThreshold || 500;
  const freeShippingDiff = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Calculate total original price to display customer savings
  const totalOriginalPrice = cart.reduce((sum, item) => {
    const orig = item.product.originalPrice || item.product.price;
    return sum + orig * item.quantity;
  }, 0);
  const totalSavings = Math.max(0, (totalOriginalPrice - subtotal) + discount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className={`absolute inset-y-0 ${isArabic ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-slate-100 h-full">
          
          {/* ── Premium Header ── */}
          <div className="bg-[#DC2626] px-4 py-3.5 text-white flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">{t('cartTitle')}</h3>
                <p className="text-[11px] font-semibold text-red-100">
                  {cart.length} {t('itemsCount')} {cart.length > 0 && `· ${totalAmount.toFixed(0)} ${t('currency')}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-bold text-red-100 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-all"
                  title="Empty Cart"
                >
                  {isArabic ? 'تفريغ' : 'Clear'}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Dynamic Free Shipping Progress Bar ── */}
          {cart.length > 0 && (
            <div className="bg-red-50/80 px-4 py-2.5 border-b border-red-100 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">
                    {isFreeShipping
                      ? (isArabic ? '🎉 مبروك! حصلت على شحن مجاني لكافة المحافظات!' : '🎉 Congratulations! Free Shipping Unlocked!')
                      : (isArabic 
                          ? `أضف بـ ${freeShippingDiff.toFixed(0)} ${t('currency')} إضافية للحصول على شحن مجاني`
                          : `Add ${freeShippingDiff.toFixed(0)} ${t('currency')} more for Free Shipping`
                        )}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-black text-red-600">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-red-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Cart Items List ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800">{t('emptyCartTitle')}</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">{t('emptyCartSub')}</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-red-600 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition-all"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const displayName = isArabic ? (item.product.arabicName || item.product.name) : item.product.name;
                const itemTotal = item.product.price * item.quantity;
                const origItemTotal = (item.product.originalPrice || item.product.price) * item.quantity;
                const hasItemDiscount = origItemTotal > itemTotal;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs relative group hover:border-red-200 transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={displayName}
                      className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xl bg-slate-50 shrink-0 border border-slate-100"
                      loading="lazy"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{item.product.brand}</span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{displayName}</h4>
                        
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-slate-900">
                            {itemTotal.toFixed(0)} {t('currency')}
                          </span>
                          {hasItemDiscount && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {origItemTotal.toFixed(0)} {t('currency')}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">({item.product.price.toFixed(0)}/قطعة)</span>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-xs font-black text-slate-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-[11px] font-bold text-slate-500">
                          {item.product.weight || '1 كجم'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Summary & Checkout Controls ── */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200/90 shadow-lg space-y-3 shrink-0">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className={`absolute ${isArabic ? 'right-2.5' : 'left-2.5'} top-2.5 w-3.5 h-3.5 text-slate-400`} />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t('couponCode')}
                    disabled={!!appliedCoupon}
                    className={`w-full ${isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-red-400`}
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {t('applyCoupon')}
                  </button>
                )}
              </form>

              {/* Total Savings Pill (if discounted) */}
              {totalSavings > 0 && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isArabic ? 'إجمالي توفيرك في هذه الطلبية:' : 'Total Savings on this Order:'}</span>
                  </div>
                  <span>{totalSavings.toFixed(0)} {t('currency')}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{t('subtotal')}</span>
                  <span className="font-bold">{subtotal.toFixed(0)} {t('currency')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>خصم الكوبون</span>
                    <span>-{discount.toFixed(0)} {t('currency')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{t('deliveryFee')}</span>
                  <span className="font-bold">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-black">{t('freeShippingBadge')}</span>
                    ) : (
                      `${shippingFee.toFixed(0)} ${t('currency')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('total')}</span>
                  <span className="text-base font-black text-red-600">{totalAmount.toFixed(0)} {t('currency')}</span>
                </div>
              </div>

              {/* Checkout CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{isArabic ? 'إتمام الطلب وتحديد موقع التوصيل' : 'Proceed to Delivery & Confirmation'}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
                </button>
              </div>

              {/* Trust Badge */}
              <div className="pt-1 flex items-center justify-center gap-3 text-[10px] text-slate-500 font-medium text-center">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>منتجات أصلية 100%</span>
                </span>
                <span>•</span>
                <span>توصيل GPS فوري</span>
                <span>•</span>
                <span>دفع عند الاستلام</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
