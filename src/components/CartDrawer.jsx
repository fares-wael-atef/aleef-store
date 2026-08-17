import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';
import { STORE_INFO } from '../data/products';

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
    isFreeShipping
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

  const freeShippingDiff = STORE_INFO.freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, (subtotal / STORE_INFO.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-red-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-5 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">سلة التسوق • أليف بيتس</h3>
                <p className="text-xs font-bold text-red-100">
                  {cart.length} {cart.length === 1 ? 'منتج' : 'منتجات'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-red-50 p-3.5 border-b border-red-100 shrink-0">
            <div className="flex items-center justify-between text-xs font-black text-slate-800 mb-1.5">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Truck className="w-4 h-4 text-red-600" />
                <span>
                  {isFreeShipping
                    ? '🎉 مبروك! حصلت على شحن مجاني لكافة المحافظات!'
                    : `أضف بـ ${freeShippingDiff.toFixed(2)} ج.م للحصول على شحن مجاني`}
                </span>
              </div>
              <span className="text-red-700 font-mono">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-red-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-3 rtl:space-x-reverse bg-red-50/30 p-3 rounded-2xl border border-red-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.arabicName || item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-red-100 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-950 truncate">
                      {item.product.arabicName || item.product.name}
                    </h4>
                    <p className="text-[11px] font-black text-red-600">
                      {item.product.price.toFixed(2)} {STORE_INFO.currencySymbol}
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                      <div className="flex items-center border border-red-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQty(item.product.id, -1)}
                          className="w-6 h-6 font-black text-slate-700 hover:bg-red-50 rounded-r-lg flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-black text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, 1)}
                          className="w-6 h-6 font-black text-slate-700 hover:bg-red-50 rounded-l-lg flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-black text-slate-950">
                      {(item.product.price * item.quantity).toFixed(2)} {STORE_INFO.currencySymbol}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h4 className="text-sm font-black text-slate-900">سلتك فارغة حالياً</h4>
                <p className="text-xs text-slate-500">اختر طعام جاف أو مستلزمات لأليفك وأضفها للسلة!</p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-red-100 space-y-4 shrink-0 shadow-lg">
              
              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="كود الخصم (ALEEFPETS10)"
                    className="w-full pr-8 pl-3 py-2 bg-red-50/40 border border-red-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 uppercase"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-red-700 transition-colors shadow-sm"
                >
                  تطبيق
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-red-100 p-2 rounded-lg text-xs font-black text-red-900">
                  <span>تم تطبيق الخصم: {appliedCoupon}</span>
                  <button onClick={removeCoupon} className="text-red-600 font-extrabold hover:underline">
                    إزالة
                  </button>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1 text-xs font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600 font-black">
                    <span>الخصم</span>
                    <span>-{discount.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>رسوم التوصيل</span>
                  <span>{shippingFee === 0 ? 'مجاناً ⚡' : `${shippingFee.toFixed(2)} ${STORE_INFO.currencySymbol}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-red-100">
                  <span>الإجمالي النهائي</span>
                  <span className="text-red-600">{totalAmount.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all active:scale-95 text-sm"
              >
                <span>متابعة الشراء وتحديد موقع التوصيل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-slate-400 hover:text-red-600 font-extrabold"
              >
                تفريغ السلة
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
