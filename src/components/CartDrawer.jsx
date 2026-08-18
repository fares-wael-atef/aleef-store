import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';

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

  const freeShippingDiff = (STORE_INFO.freeShippingThreshold || 500) - subtotal;
  const progressPercent = Math.min(100, (subtotal / (STORE_INFO.freeShippingThreshold || 500)) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className={`absolute inset-y-0 ${isArabic ? 'left-0 pr-10' : 'right-0 pl-10'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-slate-100">
          
          {/* Header */}
          <div className="bg-[#DC2626] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">{t('cartTitle')}</h3>
                <p className="text-xs font-bold text-red-100">
                  {cart.length} {t('itemsCount')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-red-50 p-3 border-b border-red-100 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>
                  {isFreeShipping
                    ? (isArabic ? '🎉 مبروك! حصلت على شحن مجاني!' : '🎉 Congratulations! You have Free Shipping!')
                    : (isArabic 
                        ? `أضف بـ ${freeShippingDiff.toFixed(0)} ${t('currency')} للحصول على شحن مجاني`
                        : `Add ${freeShippingDiff.toFixed(0)} ${t('currency')} more for Free Shipping`
                      )}
                </span>
              </div>
              <span className="font-mono text-[11px] text-red-700">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-slate-800">{t('emptyCartTitle')}</h4>
                <p className="text-xs text-slate-500 max-w-xs">{t('emptyCartSub')}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-red-700 transition-colors"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const displayName = isArabic ? (item.product.arabicName || item.product.name) : item.product.name;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={displayName}
                      className="w-16 h-16 object-cover rounded-xl bg-white shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-wider">{item.product.brand}</span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{displayName}</h4>
                        <p className="text-xs font-black text-slate-800 mt-0.5">
                          {(item.product.price * item.quantity).toFixed(0)} {t('currency')}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-black text-slate-800 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-100 shadow-lg space-y-3 shrink-0">
              
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
                    className={`w-full ${isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-red-400`}
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

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>{t('total')}</span>
                  <span className="text-base font-black text-red-600">{totalAmount.toFixed(0)} {t('currency')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowLeft className={`w-4 h-4 ${!isArabic ? 'rotate-180' : ''}`} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
