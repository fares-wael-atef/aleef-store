import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import LocationPickerMap from './LocationPickerMap';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Navigation, 
  CheckCircle, 
  MessageCircle, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function CheckoutModal() {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    userLocation,
    setUserLocation,
    detectUserLocation,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    clearCart,
    buildWhatsAppOrderMessage,
    setActiveOrder,
    setIsOrderTrackingOpen,
    showToast,
    createOrder
  } = useStore();

  const [step, setStep] = useState(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [district, setDistrict] = useState(userLocation.district || 'القاهرة - المعادي');
  const [buildingNotes, setBuildingNotes] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('express'); // express, evening, tomorrow
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card-delivery, online
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(STORE_INFO.whatsappNumber);

  if (!isCheckoutOpen) return null;

  const handleLocationUpdate = (lat, lng) => {
    setUserLocation((prev) => ({
      ...prev,
      lat,
      lng,
      addressText: `إحداثيات الموقع (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
    }));
  };

  const handleSendOtp = () => {
    if (!customerPhone.trim()) {
      showToast('يرجى كتابة رقم الهاتف أولاً', 'error');
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      showToast('تم إرسال كود التفعيل 4821 لهاتفك!', 'info');
      setOtpCode('4821');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '4821' || otpCode.length >= 4) {
      setIsOtpVerified(true);
      showToast('تم تأكيد رقم الهاتف بنجاح! ✅');
    } else {
      showToast('كود غير صحيح، استخدم 4821', 'error');
    }
  };

  const handlePlaceOrder = (orderMode = 'standard') => {
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('يرجى إدخال الاسم ورقم الهاتف', 'error');
      setStep(1);
      return;
    }

    const orderId = `ALF-EG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName,
      customerPhone,
      address: `${district}، العمارة/الشقة: ${buildingNotes || 'غير محدد'}`,
      coordinates: { lat: userLocation.lat, lng: userLocation.lng },
      mapsUrl: `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`,
      items: [...cart],
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod,
      deliverySlot,
      status: 'pending',
      driverName: 'الكابتن محمد (مندوب أليف بيتس)',
      driverPhone: STORE_INFO.phone1
    };

    // Save to admin database / localStorage & play notification chime
    if (createOrder) {
      createOrder(newOrder);
    }

    if (orderMode === 'whatsapp') {
      const whatsappMsg = buildWhatsAppOrderMessage(
        { name: customerName, phone: customerPhone, address: newOrder.address },
        cart,
        totalAmount,
        userLocation
      );
      window.open(`https://wa.me/${selectedWhatsApp}?text=${whatsappMsg}`, '_blank');
      showToast('تم تحويل طلبك للواتساب مباشرة! 📱');
    } else {
      showToast(`تم تسجيل طلبك رقم ${orderId} بنجاح! 🎉`);
    }

    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-red-100 relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-xl backdrop-blur-sm">
              📍
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">إتمام الطلب وتحديد موقع التوصيل</h3>
              <p className="text-xs font-bold text-red-100">
                أليف بيتس - خدمة التوصيل السريع بالـ GPS 🇪🇬
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Breadcrumb */}
        <div className="bg-red-50/70 px-6 py-2 border-b border-red-100 shrink-0 flex items-center justify-between text-xs font-black text-slate-700">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center space-x-1 rtl:space-x-reverse ${step >= 1 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>بيانات العميل</span>
          </button>
          <span>←</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center space-x-1 rtl:space-x-reverse ${step >= 2 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>الخريطة والـ GPS</span>
          </button>
          <span>←</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center space-x-1 rtl:space-x-reverse ${step >= 3 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>الدفع والتأكيد</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* STEP 1: Customer Contact Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase">بيانات المستلم في مصر</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">الاسم الكامل *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        className="w-full pr-9 pl-3 py-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-400 focus:outline-none"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">رقم الهاتف / الواتساب *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full pr-9 pl-3 py-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-400 focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase">تفاصيل العنوان والمنطقة</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">المدينة / الحي</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-400 focus:outline-none"
                    >
                      <option value="القاهرة - المعادي">القاهرة - المعادي</option>
                      <option value="القاهرة - التجمع الخامس والقاهرة الجديدة">القاهرة - التجمع الخامس</option>
                      <option value="القاهرة - مدينة نصر ومصر الجديدة">القاهرة - مدينة نصر / مصر الجديدة</option>
                      <option value="القاهرة - الزمالك والمهندسين">القاهرة - الزمالك والمهندسين</option>
                      <option value="الجيزة - الشيخ زايد و6 أكتوبر">الجيزة - الشيخ زايد و6 أكتوبر</option>
                      <option value="الجيزة - الدقي والهرم">الجيزة - الدقي والهرم</option>
                      <option value="الإسكندرية - سموحة ومحرم بك">الإسكندرية - سموحة ومحرم بك</option>
                      <option value="محافظات أخرى">محافظات الدلتا والقناة والصعيد</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">رقم العمارة / الشقة / علامة مميزة</label>
                    <input
                      type="text"
                      value={buildingNotes}
                      onChange={(e) => setBuildingNotes(e.target.value)}
                      placeholder="مثال: عمارة 15 شارع النصر، شقة 4"
                      className="w-full px-3 py-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!customerName || !customerPhone) {
                    showToast('يرجى كتابة الاسم ورقم الهاتف للمتابعة', 'error');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all text-xs sm:text-sm"
              >
                <span>الانتقال لتحديد الموقع بالـ GPS</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Interactive Location Map & GPS */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* GPS Auto-detect Trigger */}
              <div className="flex items-center justify-between bg-gradient-to-r from-red-100 to-rose-100 p-3 rounded-2xl text-slate-950 shadow-sm border border-red-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                    <Navigation className="w-4 h-4 animate-spin" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">تحديد موقعي التلقائي عبر الـ GPS</h5>
                    <p className="text-[11px] text-slate-600">لتسريع التوصيل بدقة لباب بيتك</p>
                  </div>
                </div>
                <button
                  onClick={detectUserLocation}
                  className="bg-slate-950 text-white text-xs font-black px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow"
                >
                  تحديد موقعي الآن
                </button>
              </div>

              {/* Interactive Map */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>اسحب الدبوس أو انقر على الخريطة لتعديل العنوان الدقيق:</span>
                  <span className="text-red-700 font-mono text-[11px]">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
                </div>

                <div className="h-64 rounded-2xl overflow-hidden border-2 border-red-200 shadow-inner">
                  <LocationPickerMap
                    lat={userLocation.lat}
                    lng={userLocation.lng}
                    onLocationChange={handleLocationUpdate}
                  />
                </div>
              </div>

              {/* Delivery Timing Options */}
              <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100 space-y-2">
                <label className="block text-xs font-black text-slate-900">موعد التوصيل المفضل:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'express', label: '⚡ فوري (خلال ساعتين)', desc: 'القاهرة والجيزة' },
                    { id: 'evening', label: '🌙 مسائي (6م - 10م)', desc: 'نفس اليوم' },
                    { id: 'tomorrow', label: '📅 غداً صباحاً', desc: 'أي محافظة' },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        deliverySlot === slot.id
                          ? 'bg-red-600 border-red-600 text-white shadow-sm font-black'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-red-50 font-bold'
                      }`}
                    >
                      <div className="font-extrabold text-[11px]">{slot.label}</div>
                      <div className="text-[9px] opacity-80 mt-0.5">{slot.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-2xl text-xs transition-colors"
                >
                  الرجوع للبيانات
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm"
                >
                  <span>متابعة لخيارات الدفع وتأكيد الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OTP Verification & Payment Choice */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Phone Verification (OTP) Simulation */}
              <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-black text-slate-900">تأكيد رقم الهاتف عبر الـ OTP (اختياري)</span>
                  </div>
                  {isOtpVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>تم التحقق</span>
                    </span>
                  )}
                </div>

                {!isOtpVerified && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="أدخل كود 4821"
                      className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold text-center tracking-widest focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="bg-red-100 text-red-900 font-black px-3 py-2 rounded-xl text-xs hover:bg-red-200 shrink-0"
                    >
                      {isSendingOtp ? 'جاري الإرسال...' : 'إرسال كود'}
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="bg-slate-950 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-slate-800 shrink-0"
                    >
                      تأكيد
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900">طريقة الدفع:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'cod', label: '💵 دفع عند الاستلام', desc: 'نقداً مع مندوب أليف بيتس' },
                    { id: 'card-delivery', label: '💳 فيزا عند الاستلام', desc: 'ماكينة POS مع المندوب' },
                    { id: 'instapay', label: '⚡ انستاباي / فودافون كاش', desc: 'تحويل مباشر لمحفظة المتجر' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border text-right transition-all ${
                        paymentMethod === m.id
                          ? 'bg-red-600 border-red-600 text-white font-black shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-red-50 font-bold'
                      }`}
                    >
                      <div className="font-extrabold">{m.label}</div>
                      <div className="text-[10px] opacity-80 mt-1">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Number Selection for Order */}
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 space-y-1.5">
                <label className="block text-xs font-black text-emerald-900">إرسال الطلب إلى رقم واتساب أليف بيتس:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedWhatsApp(STORE_INFO.whatsappNumber)}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse border ${
                      selectedWhatsApp === STORE_INFO.whatsappNumber
                        ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-sm'
                        : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>رقم 1: {STORE_INFO.phone1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWhatsApp(STORE_INFO.whatsappNumber2)}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse border ${
                      selectedWhatsApp === STORE_INFO.whatsappNumber2
                        ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-sm'
                        : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>رقم 2: {STORE_INFO.phone2}</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-2 text-xs font-bold">
                <div className="flex justify-between text-slate-300">
                  <span>إجمالي المنتجات ({cart.length})</span>
                  <span>{subtotal.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>الخصم المطبق</span>
                    <span>-{discount.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>الشحن والتوصيل</span>
                  <span>{shippingFee === 0 ? 'مجاناً ⚡' : `${shippingFee.toFixed(2)} ${STORE_INFO.currencySymbol}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-red-400 pt-2 border-t border-slate-800">
                  <span>المبلغ الإجمالي للدفع</span>
                  <span className="text-base font-black text-white">{totalAmount.toFixed(2)} {STORE_INFO.currencySymbol}</span>
                </div>
              </div>

              {/* Order Submission Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handlePlaceOrder('whatsapp')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>تأكيد الطلب وإرساله عبر الواتساب مباشرة 📱</span>
                </button>

                <button
                  onClick={() => handlePlaceOrder('standard')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-2xl transition-colors text-xs shadow-md"
                >
                  تأكيد وحفظ الطلب في الموقع وتتبع المندوب ⚡
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
