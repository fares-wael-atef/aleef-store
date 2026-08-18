import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const { STORE_INFO } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedNum, setSelectedNum] = useState(STORE_INFO.whatsappNumber || '+201110450247');

  const quickQuestions = [
    "🚚 ما هي مواعيد التوصيل للقاهرة والجيزة والمحافظات؟",
    "🐱 ما هو أفضل أنواع طعام القطط الجاف (Dry Food) المتوفر؟",
    "🐶 هل يتوفر لديكم رمل كندي ومكافآت كلاب أصلية؟",
    "👩‍⚕️ أريد التحدث مع خدمة عملاء أليف بيتس"
  ];

  const handleSendQuick = (questionText) => {
    const link = `https://wa.me/${selectedNum}?text=${encodeURIComponent(questionText)}`;
    window.open(link, '_blank');
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const link = `https://wa.me/${selectedNum}?text=${encodeURIComponent(customMsg)}`;
    window.open(link, '_blank');
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40" dir="rtl">
      {/* Expandable Chat Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-88 bg-white rounded-3xl shadow-2xl border border-emerald-500 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-emerald-600 p-3.5 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-black">خدمة عملاء أليف بيتس 🇪🇬</h4>
                <p className="text-[10px] text-emerald-100 font-bold">متواجدون الآن • رد فوري</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* WhatsApp Number Switcher */}
          <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 text-[10px]">الرقم:</span>
            <div className="flex gap-1 font-mono">
              <button
                type="button"
                onClick={() => setSelectedNum(STORE_INFO.whatsappNumber)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                  selectedNum === STORE_INFO.whatsappNumber
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-emerald-100'
                }`}
              >
                {STORE_INFO.phone1}
              </button>
              <button
                type="button"
                onClick={() => setSelectedNum(STORE_INFO.whatsappNumber2)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                  selectedNum === STORE_INFO.whatsappNumber2
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-emerald-100'
                }`}
              >
                {STORE_INFO.phone2}
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-3 space-y-2 bg-emerald-50/20 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs text-right">
              <p className="font-black text-slate-900 text-xs">أهلاً بك في أليف بيتس! 👋</p>
              <p className="text-slate-600 text-[10px] font-bold mt-0.5">
                اضغط على أي استفسار لبدء المحادثة على واتساب:
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-1 text-right">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuick(q)}
                  className="w-full text-right bg-white hover:bg-emerald-50 text-slate-800 font-bold p-2 rounded-lg border border-emerald-100 text-[10px] transition-colors truncate block"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSendCustom} className="pt-1 flex gap-1">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-emerald-500 hover:bg-emerald-600 text-white p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center border-2 border-white"
        title="تحدث معنا على الواتساب"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-500" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
