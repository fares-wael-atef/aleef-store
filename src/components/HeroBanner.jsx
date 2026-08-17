import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MessageCircle, ArrowLeft, PhoneCall } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function HeroBanner() {
  const { setSelectedSpecies } = useStore();

  return (
    <div className="relative overflow-hidden bg-slate-100/60 py-6 sm:py-8 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner Card Container */}
        <div className="bg-gradient-to-r from-red-100/80 via-white to-rose-50 rounded-3xl border border-red-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Pets Illustration Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-red-100 max-w-md w-full h-52 sm:h-64">
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                  alt="أليف بيتس - عروض طعام ومستلزمات الحيوانات الأليفة"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-md">
                  أليف بيتس مصر 🇪🇬
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-xl">
                  📞 {STORE_INFO.phone1} / {STORE_INFO.phone2}
                </div>
              </div>
            </div>

            {/* Main Offer Announcement (Center / Spans full remaining space) */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-4">
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-red-100 text-red-900 text-xs font-black px-3.5 py-1.5 rounded-full border border-red-300 shadow-sm">
                <Sparkles className="w-4 h-4 text-red-600 animate-pulse" />
                <span>أليف بيتس (Aleef Pets) - أقوى عروض طعام ومستلزمات الحيوانات الأليفة 🎉</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
                خصومات تصل إلى <span className="text-red-600 underline decoration-red-300">30%</span> على أفضل الماركات!
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                أجود أنواع طعام القطط والكلاب الجاف (Dry Food) والرطب، رمل كندي فاخر، مكافآت وألعاب مع توصيل سريع لجميع المحافظات: القاهرة، الجيزة، الإسكندرية، التجمع، والشيخ زايد!
              </p>

              {/* Action Buttons with both WhatsApp numbers */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setSelectedSpecies('cat')}
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm active:scale-95"
                >
                  <span>تسوق منتجات Dry Food</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس!%20أريد%20الطلب%20والاستفسار`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 sm:px-5 py-3 rounded-xl shadow transition-all flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب 1: {STORE_INFO.phone1}</span>
                </a>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber2}?text=السلام%20عليكم%20أليف%20بيتس!%20أريد%20الطلب%20والاستفسار`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 sm:px-5 py-3 rounded-xl shadow transition-all flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب 2: {STORE_INFO.phone2}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
