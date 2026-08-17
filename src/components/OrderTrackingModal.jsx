import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle2, Clock, Phone, MapPin, Truck, Package, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function OrderTrackingModal() {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, activeOrder } = useStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(2); // 0: Placed, 1: Confirmed, 2: Packing, 3: Out for Delivery

  // Simulate live order status updates
  useEffect(() => {
    if (isOrderTrackingOpen && activeOrder) {
      const timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < 3 ? prev + 1 : prev));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isOrderTrackingOpen, activeOrder]);

  if (!isOrderTrackingOpen || !activeOrder) return null;

  const steps = [
    { title: 'تم استلام الطلب', desc: 'تم تسجيل الطلب في نظام أليف بيتس', icon: Package },
    { title: 'تأكيد المنتجات', desc: 'التحقق من توفر أكياس الـ Dry Food', icon: CheckCircle2 },
    { title: 'تجهيز وتغليف الطلب', desc: 'جاري التغليف بعناية والتجهيز للشحن', icon: Clock },
    { title: 'خرج للتوصيل السريع', desc: `المندوب ${activeOrder.driverName} في الطريق إليك!`, icon: Truck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-red-100 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-sm">
              🛵
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">تتبع حالة الطلب المباشر</h3>
              <p className="text-xs font-semibold text-red-100">رقم الطلب: #{activeOrder.orderId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-right">
          
          {/* Status Timeline */}
          <div className="bg-red-50/40 p-4 rounded-2xl border border-red-100">
            <h4 className="text-xs font-black text-slate-900 uppercase mb-4">مراحل تنفيذ وتوصيل الطلب</h4>
            
            <div className="relative pr-6 space-y-6 before:absolute before:right-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-red-200">
              {steps.map((st, idx) => {
                const IconComp = st.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="relative flex items-start space-x-3 rtl:space-x-reverse">
                    <div
                      className={`absolute -right-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <p className={`text-xs font-black ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.title} {isCurrent && <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-md mr-2 animate-pulse">جاري الآن</span>}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Driver Info */}
          <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
                  👨‍✈️
                </div>
                <div>
                  <p className="text-xs font-black text-white">{activeOrder.driverName}</p>
                  <p className="text-[11px] text-slate-300">مندوب التوصيل السريع بالـ GPS</p>
                </div>
              </div>
              
              <a
                href={`tel:${activeOrder.driverPhone}`}
                className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl font-bold text-xs flex items-center space-x-1 rtl:space-x-reverse shadow"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال بالمندوب</span>
              </a>
            </div>

            <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800 flex justify-between items-center">
              <span>عنوان التوصيل:</span>
              <span className="font-bold text-white truncate max-w-[200px]">{activeOrder.address}</span>
            </div>
          </div>

          {/* Order Receipt Breakdown */}
          <div className="border border-red-100 rounded-2xl p-4 space-y-2 text-xs bg-red-50/20">
            <h4 className="font-black text-slate-900 uppercase">المنتجات المطلوبة</h4>
            <div className="divide-y divide-red-100">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">
                    {item.product.arabicName || item.product.name} (x{item.quantity})
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {(item.product.price * item.quantity).toFixed(2)} {STORE_INFO.currencySymbol}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-red-200 flex justify-between font-black text-sm text-slate-900">
              <span>المبلغ الإجمالي</span>
              <span className="text-red-600 font-bold">{activeOrder.totalAmount.toFixed(2)} {STORE_INFO.currencySymbol}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
                `السلام عليكم أليف بيتس! أريد الاستفسار عن طلبي رقم #${activeOrder.orderId}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse text-xs shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>متابعة على واتساب أليف بيتس</span>
            </a>

            <button
              onClick={() => setIsOrderTrackingOpen(false)}
              className="bg-slate-900 text-white font-extrabold px-5 py-3 rounded-xl text-xs hover:bg-slate-800"
            >
              إغلاق
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
