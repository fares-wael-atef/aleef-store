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
    createOrder,
    STORE_INFO,
    t,
    isArabic
  } = useStore();

  const [step, setStep] = useState(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [district, setDistrict] = useState(userLocation.district || (isArabic ? 'القاهرة - المعادي' : 'Cairo - Maadi'));
  const [buildingNotes, setBuildingNotes] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('express'); // express, evening, tomorrow
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card-delivery, online
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(STORE_INFO.whatsappNumber);

  if (!isCheckoutOpen) return null;

  const handleLocationUpdate = (lat, lng) => {
    setUserLocation((prev) => ({
      ...prev,
      lat,
      lng,
      addressText: `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
    }));
  };

  const handlePlaceOrder = (orderMode = 'standard') => {
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast(isArabic ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please enter your name and phone number', 'error');
      setStep(1);
      return;
    }

    const orderId = `ALF-EG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName,
      customerPhone,
      address: `${district}، ${isArabic ? 'العمارة/الشقة:' : 'Building/Apt:'} ${buildingNotes || (isArabic ? 'غير محدد' : 'N/A')}`,
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
      driverName: isArabic ? 'الكابتن محمد (مندوب أليف بيتس)' : 'Captain Mohamed (Aleef Courier)',
      driverPhone: STORE_INFO.phone1
    };

    // Save to admin database & play notification chime
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
      showToast(isArabic ? 'تم تحويل طلبك للواتساب مباشرة! 📱' : 'Redirected to WhatsApp! 📱');
    } else {
      showToast(isArabic ? `تم تسجيل طلبك رقم ${orderId} بنجاح! 🎉` : `Order ${orderId} placed successfully! 🎉`);
    }

    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-red-100 relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#DC2626] p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-lg backdrop-blur-sm">
              📍
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{t('checkoutTitle')}</h3>
              <p className="text-xs font-bold text-red-100">
                {t('checkoutSub')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center font-bold text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step Breadcrumb */}
        <div className="bg-red-50/70 px-4 sm:px-6 py-2 border-b border-red-100 shrink-0 flex items-center justify-between text-xs font-bold text-slate-700">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1 ${step >= 1 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>{isArabic ? 'بيانات العميل' : 'Customer Info'}</span>
          </button>
          <span>{isArabic ? '←' : '→'}</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1 ${step >= 2 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>{isArabic ? 'الموقع و GPS' : 'GPS Location'}</span>
          </button>
          <span>{isArabic ? '←' : '→'}</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1 ${step >= 3 ? 'text-red-700 font-black' : 'opacity-50'}`}
          >
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>{isArabic ? 'التأكيد والإرسال' : 'Confirmation'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">{t('fullName')}</label>
                <div className="relative">
                  <User className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-4 h-4 text-slate-400`} />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isArabic ? "مثال: أحمد محمود" : "e.g. Ahmed Mahmoud"}
                    className={`w-full ${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">{t('phoneNumber')}</label>
                <div className="relative">
                  <Phone className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-4 h-4 text-slate-400`} />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className={`w-full ${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-red-400`}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">{t('cityDistrict')}</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={isArabic ? "القاهرة - المعادي" : "Cairo - Maadi"}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">{t('buildingDetails')}</label>
                  <input
                    type="text"
                    value={buildingNotes}
                    onChange={(e) => setBuildingNotes(e.target.value)}
                    placeholder={isArabic ? "عمارة 15 الدور 4 شقة 8" : "Bldg 15, Apt 8"}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (!customerName.trim() || !customerPhone.trim()) {
                      showToast(isArabic ? 'يرجى إدخال الاسم ورقم الهاتف للمتابعة' : 'Please enter your name and phone number', 'error');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow transition-colors"
                >
                  {isArabic ? 'متابعة إلى تحديد الموقع GPS ←' : 'Continue to GPS Location →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location Map */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">{isArabic ? 'حدد موقعك بدقة على الخريطة:' : 'Pin delivery location on map:'}</span>
                <button
                  onClick={detectUserLocation}
                  className="flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t('detectGPS')}</span>
                </button>
              </div>

              <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <LocationPickerMap
                  lat={userLocation.lat}
                  lng={userLocation.lng}
                  onLocationSelect={handleLocationUpdate}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  {isArabic ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow transition-colors"
                >
                  {isArabic ? 'متابعة لتأكيد الطلب ←' : 'Continue to Order Summary →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Summary & Place */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              {/* Payment selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">{t('paymentMethod')}</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border font-bold text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💵 {t('cashOnDelivery')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card-delivery')}
                    className={`p-3 rounded-xl border font-bold text-center transition-all ${
                      paymentMethod === 'card-delivery'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💳 {t('cardOnDelivery')}
                  </button>
                </div>
              </div>

              {/* Order total review box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t('subtotal')} ({cart.length} {t('itemsCount')}):</span>
                  <span className="font-bold">{subtotal.toFixed(0)} {t('currency')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>خصم:</span>
                    <span>-{discount.toFixed(0)} {t('currency')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{t('deliveryFee')}:</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? <span className="text-emerald-600">{t('freeShippingBadge')}</span> : `${shippingFee.toFixed(0)} ${t('currency')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>{t('total')}:</span>
                  <span className="text-base font-black text-red-600">{totalAmount.toFixed(0)} {t('currency')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handlePlaceOrder('standard')}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('confirmAndPlaceOrder')}</span>
                </button>

                <button
                  onClick={() => handlePlaceOrder('whatsapp')}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('orderViaWhatsApp')}</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  {isArabic ? '← العودة لتعديل الموقع' : '← Back to edit location'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
