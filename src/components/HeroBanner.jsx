import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, ArrowDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// High definition animal videos with reliable fallbacks
const SLIDES = [
  {
    video: "https://videos.pexels.com/video-files/4588013/4588013-hd_1920_1080_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80",
    badge: "أليف بيتس مصر",
    title: "أليفك يستحق الأفضل دائماً",
    subtitle: "أجود أنواع طعام القطط والكلاب والطيور الأصلية مع توصيل سريع لباب بيتك",
  },
  {
    video: "https://videos.pexels.com/video-files/4498159/4498159-hd_1920_1080_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1600&q=80",
    badge: "ماركات عالمية أصلية 100%",
    title: "Royal Canin · Purina · Hill's · OdorLock",
    subtitle: "تغذية متكاملة ورعاية صحية فائقة تناسب جميع أعمار واحتياجات أليفك",
  },
  {
    video: "https://videos.pexels.com/video-files/4786001/4786001-hd_1920_1080_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1600&q=80",
    badge: "خدمة التوصيل السريع",
    title: "توصيل لجميع محافظات مصر",
    subtitle: "شحن مجاني للطلبات فوق 500 ج.م مع إمكانية الدفع عند الاستلام أو بالبطاقة",
  },
];

export default function HeroBanner() {
  const { STORE_INFO } = useStore();
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const touchStartX = useRef(null);
  const autoPlayTimerRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % SLIDES.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goToSlide]);

  // Auto switch slides every 6 seconds
  useEffect(() => {
    autoPlayTimerRef.current = setInterval(nextSlide, 6000);
    return () => clearInterval(autoPlayTimerRef.current);
  }, [nextSlide]);

  // Manage video playback
  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === current) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    });
  }, [current]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden bg-slate-950 select-none shadow-2xl"
      style={{ minHeight: '340px', height: 'clamp(340px, 46vh, 480px)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      dir="rtl"
    >
      {/* ── Video Background Layers ── */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <video
            ref={(el) => (videoRefs.current[idx] = el)}
            src={slide.video}
            poster={slide.poster}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />

          {/* Cinematic Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/55 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        </div>
      ))}

      {/* ── Foreground Text & CTAs ── */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
          <div className="max-w-xl text-right space-y-3 sm:space-y-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/40 text-red-300 text-[11px] font-black px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>{SLIDES[current].badge}</span>
            </div>

            {/* Slide Title */}
            <h1
              key={`title-${current}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight animate-fade-in-up"
            >
              {SLIDES[current].title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-md opacity-90 animate-fade-in-up"
            >
              {SLIDES[current].subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToProducts}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl shadow-red-900/50 transition-all flex items-center gap-2"
              >
                <span>تسوق الآن</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('السلام عليكم أليف بيتس، أريد الاستفسار والطلب')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl shadow-emerald-950/40 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>اطلب عبر الواتساب</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ── Slide Arrows Controls ── */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all active:scale-90"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all active:scale-90"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Bottom Controls: Dots & Audio Toggle ── */}
      <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-between px-6 max-w-7xl mx-auto pointer-events-none">
        
        {/* Slide Dots Indicator */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-7 h-2 bg-red-500 shadow-md shadow-red-500/50'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Video Sound Mute/Unmute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="pointer-events-auto p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md transition-all text-xs flex items-center gap-1.5"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          <span className="hidden sm:inline font-bold text-[10px]">
            {isMuted ? 'صوت الفيديو كتم' : 'الصوت مفعل'}
          </span>
        </button>

      </div>

    </section>
  );
}
