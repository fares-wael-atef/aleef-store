import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, CreditCard, Star } from 'lucide-react';
import { STORE_INFO } from '../data/products';

const STATS = [
  { value: "20+",   label: "ماركة عالمية" },
  { value: "5K+",   label: "عميل سعيد"     },
  { value: "100+",  label: "منتج أصلي"     },
  { value: "24h",   label: "توصيل سريع"    },
];

const TRUST = [
  { icon: Truck,        label: "شحن مجاني فوق 500 ج.م"   },
  { icon: MessageCircle,label: "طلب فوري عبر الواتساب"    },
  { icon: CreditCard,   label: "دفع عند الاستلام أو أونلاين"},
  { icon: ShieldCheck,  label: "منتجات أصلية 100% مضمونة" },
];

const SHORTCUT_CATS = [
  { label: "طعام قطط جاف",   species: "cat",  category: "dry-food"  },
  { label: "رمل قطط",        species: "cat",  category: "litter"    },
  { label: "طعام كلاب",      species: "dog",  category: "dry-food"  },
  { label: "مكافآت وعلاجات", species: "dog",  category: "wet-food"  },
  { label: "طيور وأسماك",    species: "bird", category: "dry-food"  },
  { label: "العناية",        species: "all",  category: "grooming"  },
];

export default function HeroBanner() {
  const { setSelectedSpecies, setSelectedCategory } = useStore();

  const goTo = (species, category) => {
    setSelectedSpecies(species);
    setSelectedCategory(category);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div dir="rtl">

      {/* ══════════════════════════════════════════
          HERO SECTION — split layout
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0f0a0a]">

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-red-700/20 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-red-900/15 blur-[80px] pointer-events-none translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] items-center gap-10 py-14 sm:py-16 lg:py-20">

            {/* ── Left: text content ── */}
            <div className="order-1 lg:order-2 space-y-7">

              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 text-red-400 text-[11px] font-black px-3.5 py-1.5 rounded-full tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                متجر أليف بيتس — القاهرة
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
                  أليفك يستحق
                  <br />
                  <span className="text-red-500">الأفضل دائماً</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-md pt-2">
                  أجود أنواع طعام القطط والكلاب والطيور من أشهر الماركات العالمية — مع توصيل سريع لباب بيتك في مصر.
                </p>
              </div>

              {/* Brand pills */}
              <div className="flex flex-wrap gap-2">
                {["Royal Canin","Purina Pro Plan","Hill's","OdorLock","FURminator","Whiskas"].map(b => (
                  <span key={b} className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full tracking-wide">
                    {b}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg shadow-red-600/30 transition-all text-sm"
                >
                  <span>تسوق الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('السلام عليكم أليف بيتس - أريد الاستفسار عن منتج')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp flex items-center gap-2.5 bg-[#25D366] hover:bg-[#22c35e] active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/30 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </a>
              </div>

              {/* Rating social proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
                    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#0f0a0a]" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    <span className="text-white font-black text-xs mr-1">4.9</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-medium">+5,000 عميل سعيد</p>
                </div>
              </div>
            </div>

            {/* ── Right: image panel ── */}
            <div className="order-2 lg:order-1 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm lg:max-w-none">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-3xl scale-90 translate-y-4" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=85"
                    alt="Aleef Pets - أليف بيتس"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating card — discount */}
                <div className="absolute -top-4 -left-4 bg-red-600 text-white rounded-2xl px-4 py-3 shadow-xl shadow-red-900/40">
                  <div className="text-xl font-black leading-none">15%</div>
                  <div className="text-[10px] font-bold opacity-80 leading-none mt-0.5">خصم خاص</div>
                </div>

                {/* Floating card — free shipping */}
                <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900">شحن مجاني</div>
                    <div className="text-[9px] text-slate-500 font-medium">فوق 500 ج.م</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="relative border-t border-white/8 bg-white/3 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-white">{value}</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORY SHORTCUTS — visual cards row
      ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {SHORTCUT_CATS.map(({ label, species, category }) => (
              <button
                key={label}
                onClick={() => goTo(species, category)}
                className="group flex flex-col items-center gap-2 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 rounded-2xl p-3 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-red-600 flex items-center justify-center transition-colors shrink-0">
                  <svg viewBox="0 0 100 100" className="w-5 h-5 fill-red-600 group-hover:fill-white transition-colors">
                    <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
                    <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
                    <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
                    <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
                    <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-red-700 text-center leading-tight transition-colors">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BADGES — full-width strip
      ══════════════════════════════════════════ */}
      <section className="bg-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white">
                <Icon className="w-4 h-4 opacity-80 shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
