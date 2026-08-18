import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { STORE_INFO } from '../data/products';

const TRUST_BADGES = [
  { icon: Truck,        text: "توصيل سريع لجميع المحافظات"     },
  { icon: MessageCircle,text: "طلب فوري عبر الواتساب"           },
  { icon: CreditCard,   text: "دفع عند الاستلام أو بالكارت"    },
  { icon: ShieldCheck,  text: "منتجات أصلية 100% مضمونة"        },
];

const CATEGORY_SHORTCUTS = [
  { label: "طعام قطط جاف",    species: "cat",  category: "dry-food"  },
  { label: "رمل قطط",         species: "cat",  category: "litter"    },
  { label: "طعام كلاب",       species: "dog",  category: "dry-food"  },
  { label: "مكافآت وعلاجات",  species: "dog",  category: "wet-food"  },
  { label: "طعام طيور",       species: "bird", category: "dry-food"  },
  { label: "العناية والتمشيط",species: "cat",  category: "grooming"  },
];

export default function HeroBanner() {
  const { setSelectedSpecies, setSelectedCategory } = useStore();

  const handleShortcut = (species, category) => {
    setSelectedSpecies(species);
    setSelectedCategory(category);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden hero-bg" dir="rtl">

      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Right side image panel */}
        <div className="absolute inset-y-0 left-0 w-1/2 hidden lg:block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1e1a1a]/60 to-[#1e1a1a]" />
        </div>
        {/* Subtle red glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            متجر أليف بيتس — القاهرة ومصر كلها
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            أليفك يستحق
            <span className="text-red-400"> الأفضل</span>
            <br />
            <span className="text-2xl sm:text-3xl font-bold text-slate-300">
              طعام وأدوات عالمية بأسعار مصرية
            </span>
          </h1>

          {/* Sub */}
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed mb-8 max-w-lg">
            Royal Canin · Purina Pro Plan · Hill's Science Diet · OdorLock · FURminator
            وأكثر من 100 منتج أصلي مع توصيل سريع لباب بيتك.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-red-900/40 transition-all text-sm"
            >
              تسوق الآن
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=السلام%20عليكم%20أليف%20بيتس%20-%20أريد%20الاستفسار`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black px-5 py-3.5 rounded-xl transition-all text-sm shadow"
            >
              <MessageCircle className="w-4 h-4" />
              اطلب عبر الواتساب
            </a>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber2}?text=السلام%20عليكم%20أليف%20بيتس`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/30 font-bold px-4 py-3.5 rounded-xl transition-all text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              {STORE_INFO.phone2}
            </a>
          </div>

          {/* Category shortcuts */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleShortcut(s.species, s.category)}
                className="glass text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-white/15 transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Trust badges strip ── */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4">
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-xs font-semibold leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
