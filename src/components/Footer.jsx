import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Phone, MapPin, Clock, ShieldCheck, Truck, CreditCard } from 'lucide-react';

const NAV_LINKS = [
  { label: "طعام القطط الجاف",    species: "cat",  cat: "dry-food"   },
  { label: "رمل ونظافة القطط",    species: "cat",  cat: "litter"     },
  { label: "طعام الكلاب",         species: "dog",  cat: "dry-food"   },
  { label: "مكافآت الكلاب",       species: "dog",  cat: "wet-food"   },
  { label: "ألعاب الحيوانات",     species: "all",  cat: "toys"       },
  { label: "العناية والتمشيط",    species: "all",  cat: "grooming"   },
  { label: "طعام الطيور",         species: "bird", cat: "dry-food"   },
  { label: "إكسسوارات وأدوات",   species: "all",  cat: "accessories"},
];

const PERKS = [
  { icon: Truck,        text: "توصيل سريع لجميع المحافظات"     },
  { icon: MessageCircle,text: "طلب فوري عبر الواتساب"           },
  { icon: CreditCard,   text: "دفع عند الاستلام أو بالكارت"    },
  { icon: ShieldCheck,  text: "منتجات أصلية 100% مضمونة"        },
];

export default function Footer() {
  const { STORE_INFO } = useStore();

  return (
    <footer className="bg-slate-950 text-white pt-10 sm:pt-14 pb-8 border-t border-white/5 font-sans w-full max-w-full overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:space-y-12">

        {/* ── Top perks row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12 border-b border-white/10">
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600/20 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-snug">{text}</span>
            </div>
          ))}
        </div>

        {/* ── Main columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-red-500 shrink-0">
                <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
                <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
                <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
                <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
                <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
              </svg>
              <div>
                <div className="text-base sm:text-lg font-black text-white leading-none">Aleef Pets</div>
                <div className="text-xs text-slate-400 font-medium">أليف بيتس</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              متجرك المتخصص في أجود أنواع طعام القطط والكلاب والطيور مع توصيل سريع لجميع محافظات مصر.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-colors shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {STORE_INFO.phone1}
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber2}?text=السلام%20عليكم%20أليف%20بيتس`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-colors shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {STORE_INFO.phone2}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-400">أقسام المتجر</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {NAV_LINKS.slice(0, 6).map((l) => (
                <li key={l.label}>
                  <a href="#products-section" className="text-xs text-slate-400 hover:text-white transition-colors font-medium leading-relaxed">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-400">الخدمة والسياسة</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs text-slate-400 font-medium">
              <li className="hover:text-white transition-colors cursor-default">سياسة الشحن والتوصيل</li>
              <li className="hover:text-white transition-colors cursor-default">سياسة الاستبدال والاسترجاع</li>
              <li className="hover:text-white transition-colors cursor-default">ضمان المنتجات الأصلية 100%</li>
              <li className="hover:text-white transition-colors cursor-default">تواصل معنا للدعم الفني</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-400">التواصل والمواعيد</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-medium">{STORE_INFO.deliveryHours}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-mono font-bold text-white">{STORE_INFO.phone1} / {STORE_INFO.phone2}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom bar (Clean customer copyright, no admin button) ── */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-right">
          <p>© {new Date().getFullYear()} Aleef Pets — أليف بيتس مصر. جميع الحقوق محفوظة.</p>
          <div className="flex items-center justify-center gap-3 font-semibold text-slate-400 flex-wrap">
            <span>دفع عند الاستلام</span>
            <span>·</span>
            <span>فيزا وانستاباي</span>
            <span>·</span>
            <span>خدمة التوصيل السريع</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
