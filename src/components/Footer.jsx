import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/products';
import { MapPin, Phone, MessageCircle, Clock, Navigation } from 'lucide-react';

export default function Footer() {
  const { 
    setSelectedSpecies, 
    setIsOrderTrackingOpen,
    activeOrder
  } = useStore();

  return (
    <footer className="bg-slate-950 text-white pt-12 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 space-y-10" dir="rtl">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                🐾
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  أليف بيتس <span className="text-red-500">•</span> Aleef Pets
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              أليف بيتس (Aleef Pets) هو متجرك المتخصص في مصر لشراء أجود أنواع طعام القطط والكلاب الجاف (Dry Food)، الطعام الرطب، الرمل، والمستلزمات مع توصيل سريع لجميع المحافظات.
            </p>

            <div className="flex flex-col space-y-2 pt-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center space-x-1.5 rtl:space-x-reverse shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب 1: {STORE_INFO.phone1}</span>
                </a>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber2}?text=السلام%20عليكم%20أليف%20بيتس`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center space-x-1.5 rtl:space-x-reverse shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب 2: {STORE_INFO.phone2}</span>
                </a>
              </div>

              {activeOrder && (
                <button
                  onClick={() => setIsOrderTrackingOpen(true)}
                  className="bg-red-600 text-white text-xs font-black px-3 py-2 rounded-xl hover:bg-red-700 transition-colors w-fit"
                >
                  تتبع طلبي
                </button>
              )}
            </div>
          </div>

          {/* Quick Categories Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-red-400 tracking-wider">
              أقسام أليف بيتس
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-bold">
              <li>
                <button onClick={() => setSelectedSpecies('cat')} className="hover:text-red-400 transition-colors">
                  🐱 طعام القطط (Dry & Wet Food)
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedSpecies('dog')} className="hover:text-red-400 transition-colors">
                  🐶 أطعمة ومكافآت الكلاب
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedSpecies('bird')} className="hover:text-red-400 transition-colors">
                  🦜 طعام ومستلزمات الطيور
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedSpecies('fish')} className="hover:text-red-400 transition-colors">
                  🐠 طعام أسماك الزينة
                </button>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-red-400 tracking-wider">
              مميزات الخدمة
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-bold">
              <li>
                <span className="hover:text-red-400 transition-colors">
                  ⚡ توصيل سريع بالـ GPS لكل محافظات مصر
                </span>
              </li>
              <li>
                <span className="hover:text-red-400 transition-colors">
                  💳 الدفع عند الاستلام أو بالفيزا
                </span>
              </li>
              <li>
                <span className="hover:text-red-400 transition-colors">
                  📱 طلب مباشر على أرقام الواتساب
                </span>
              </li>
            </ul>
          </div>

          {/* Location & Opening Hours */}
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="text-xs font-black uppercase text-red-400 tracking-wider">
              مقر المتجر وأرقام التواصل
            </h4>
            <div className="space-y-2 font-bold">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <span>{STORE_INFO.deliveryHours}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-mono dir-ltr">{STORE_INFO.formattedPhone}</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${STORE_INFO.coordinates.lat},${STORE_INFO.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 rtl:space-x-reverse text-red-400 hover:underline font-black pt-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>موقع المتجر على خرائط جوجل</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} أليف بيتس (Aleef Pets Egypt 🇪🇬). جميع الحقوق محفوظة.</p>
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] font-black text-slate-300">
            <span>💵 الدفع عند الاستلام</span>
            <span>•</span>
            <span>💳 الفيزا وانستاباي</span>
            <span>•</span>
            <span>📱 واتساب: {STORE_INFO.phone1} / {STORE_INFO.phone2}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
