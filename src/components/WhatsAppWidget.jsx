import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedNum, setSelectedNum] = useState(STORE_INFO.whatsappNumber);

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
    <div className="fixed bottom-5 left-5 z-40" dir="rtl">
      {/* Expandable Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-black">خدمة عملاء أليف بيتس 🇪🇬</h4>
                <p className="text-[11px] text-emerald-100 font-bold">متواجدون الآن • رد فوري</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp Number Switcher */}
          <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 text-[11px]">اختر رقم الواتساب:</span>
            <div className="flex gap-1.5 font-mono">
              <button
                type="button"
                onClick={() => setSelectedNum(STORE_INFO.whatsappNumber)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
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
          <div className="p-4 space-y-3 bg-emerald-50/20 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm space-y-1 text-right">
              <p className="font-black text-slate-900">أهلاً بك في أليف بيتس! 👋</p>
              <p className="text-slate-600 text-[11px] font-bold">
                كيف يمكننا مساعدتك اليوم؟ اضغط على أي استفسار أو راسلنا على الرقم المختار:
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-1.5 pt-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">استفسارات سريعة</p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuick(q)}
                  className="w-full text-right bg-white hover:bg-emerald-100/70 text-slate-800 font-bold p-2.5 rounded-xl border border-emerald-100 text-[11px] transition-colors truncate block"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSendCustom} className="pt-2 flex gap-1.5">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl font-bold transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-white"
        title="تحدث معنا على الواتساب"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
