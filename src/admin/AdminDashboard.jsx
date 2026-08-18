import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ORDER_STATUSES, 
  getStatusInfo, 
  playOrderNotificationSound, 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  verifyAdminPassword,
  setAdminPassword
} from './adminUtils';
import { 
  ShoppingBag, 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Bell, 
  ExternalLink, 
  Phone, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  LogOut, 
  Store, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Eye,
  Filter
} from 'lucide-react';
import { CATEGORIES, SPECIES_LIST } from '../data/products';

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    resetProductsToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
    markAllOrdersSeen,
    unreadOrdersCount,
    storeInfo,
    updateStoreSettings,
    navigateToView,
    showToast
  } = useStore();

  // ── Auth State ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'analytics' | 'settings'

  // ── Orders Filter State ──
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);

  // ── Products Filter & Form State ──
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // ── Product Form Fields ──
  const initialProductForm = {
    arabicName: '',
    name: '',
    price: '',
    originalPrice: '',
    category: 'dry-food',
    species: 'cat',
    brand: 'أليف بيتس',
    weight: '1 كجم',
    inStock: true,
    isBestSeller: false,
    discountBadge: '',
    image: '',
    description: '',
    ingredients: '',
    feedingGuide: ''
  };
  const [productForm, setProductForm] = useState(initialProductForm);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // ── Settings Form ──
  const [settingsPhone1, setSettingsPhone1] = useState(storeInfo.phone1 || '01110450247');
  const [settingsPhone2, setSettingsPhone2] = useState(storeInfo.phone2 || '01065041554');
  const [settingsFreeShipping, setSettingsFreeShipping] = useState(storeInfo.freeShippingThreshold || 500);
  const [settingsDeliveryHours, setSettingsDeliveryHours] = useState(storeInfo.deliveryHours || '9:00 ص - 11:00 م يومياً');
  const [newPassword, setNewPassword] = useState('');

  // ── Auth Handlers ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(loginPass)) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setLoginError('');
      showToast('مرحباً بك في لوحة تحكم أليف بيتس! 🐾');
    } else {
      setLoginError('كلمة المرور غير صحيحة. كلمة المرور الافتراضية: admin أو aleef2024');
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    showToast('تم تسجيل الخروج بنجاح');
  };

  // ── Product Form Handlers ──
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm(initialProductForm);
    setImagePreview('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      arabicName: prod.arabicName || '',
      name: prod.name || '',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      category: prod.category || 'dry-food',
      species: prod.species || 'cat',
      brand: prod.brand || 'أليف بيتس',
      weight: prod.weight || '1 كجم',
      inStock: prod.inStock !== false,
      isBestSeller: Boolean(prod.isBestSeller),
      discountBadge: prod.discountBadge || '',
      image: prod.image || '',
      description: prod.description || '',
      ingredients: prod.ingredients || '',
      feedingGuide: prod.feedingGuide || ''
    });
    setImagePreview(prod.image || '');
    setIsProductModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً، يفضل أقل من 2 ميجابايت', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setProductForm((prev) => ({ ...prev, image: base64 }));
        showToast('تم رفع الصورة ومعاينتها بنجاح! 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.arabicName.trim() && !productForm.name.trim()) {
      showToast('يرجى كتابة اسم المنتج', 'error');
      return;
    }
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      showToast('يرجى تحديد سعر صحيح للمنتج', 'error');
      return;
    }

    const payload = {
      ...productForm,
      image: imagePreview || productForm.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
      arabicName: productForm.arabicName || productForm.name,
      name: productForm.name || productForm.arabicName,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      inStock: Boolean(productForm.inStock),
      isBestSeller: Boolean(productForm.isBestSeller)
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  // ── Settings Save ──
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateStoreSettings({
      phone1: settingsPhone1,
      phone2: settingsPhone2,
      whatsappNumber: settingsPhone1.replace(/^0/, '+20'),
      whatsappNumber2: settingsPhone2.replace(/^0/, '+20'),
      freeShippingThreshold: parseFloat(settingsFreeShipping) || 500,
      deliveryHours: settingsDeliveryHours
    });

    if (newPassword.trim()) {
      setAdminPassword(newPassword.trim());
      setNewPassword('');
      showToast('تم تحديث كلمة مرور لوحة التحكم بنجاح! 🔐');
    } else {
      showToast('تم حفظ إعدادات المتجر بنجاح! ⚙️');
    }
  };

  // ── Filtered Orders ──
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && (o.status || '').toLowerCase() !== orderStatusFilter.toLowerCase()) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchName = (o.customerName || '').toLowerCase().includes(q);
      const matchPhone = (o.customerPhone || '').toLowerCase().includes(q);
      const matchId = (o.orderId || '').toLowerCase().includes(q);
      const matchAddress = (o.address || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchAddress;
    }
    return true;
  });

  // ── Filtered Products ──
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        (p.arabicName || '').toLowerCase().includes(q) ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Analytics Stats ──
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? (o.totalAmount || 0) : 0), 0);
  const totalOrdersCount = orders.length;
  const inStockCount = products.filter((p) => p.inStock !== false).length;
  const outOfStockCount = products.length - inStockCount;

  // ── LOGIN VIEW ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-red-500 selection:text-white font-sans" dir="rtl">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة تحكم أليف بيتس</h1>
            <p className="text-xs text-slate-400 font-medium">أدخل كلمة المرور لإدارة الطلبات والمنتجات والمخزن</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة مرور المسؤول (Admin Password)</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="أدخل كلمة المرور (الافتراضية: admin)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-3 rounded-xl shadow-lg shadow-red-900/40 text-sm transition-all"
            >
              تسجيل الدخول للوحة التحكم
            </button>
          </form>

          {/* Back to store */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={() => navigateToView('store')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <Store className="w-4 h-4 text-red-500" />
              الرجوع لصفحة المتجر الرئيسية
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── MAIN ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-red-500 selection:text-white pb-16" dir="rtl">
      
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white">لوحة تحكم أليف بيتس</span>
                <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Admin v2.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">إدارة الطلبات والمخزن والأسعار</span>
            </div>
          </div>

          {/* Actions & Alerts */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Sound Test Button */}
            <button
              onClick={() => {
                playOrderNotificationSound();
                showToast('تم تشغيل نغمة إشعار الطلبات الجديدة! 🔔');
              }}
              title="تجربة صوت الإشعار"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-bold">صوت الإشعار</span>
            </button>

            {/* Notification Badge */}
            <button
              onClick={() => {
                setActiveTab('orders');
                markAllOrdersSeen();
              }}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              title="الطلبات الجديدة"
            >
              <Bell className={`w-4 h-4 ${unreadOrdersCount > 0 ? 'text-red-400 animate-bounce' : 'text-slate-400'}`} />
              {unreadOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            {/* View Storefront */}
            <button
              onClick={() => navigateToView('store')}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-red-900/40 transition-all"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">عرض المتجر</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* ── Tabs Bar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-800/80 pt-1">
          {[
            { id: 'orders',    label: 'طلبات العملاء', count: unreadOrdersCount, icon: ShoppingBag },
            { id: 'products',  label: 'إدارة المنتجات والمخزن', count: products.length, icon: Package },
            { id: 'analytics', label: 'الإحصائيات والمبيعات', icon: TrendingUp },
            { id: 'settings',  label: 'إعدادات المتجر', icon: Sliders },
          ].map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === 'orders') markAllOrdersSeen();
              }}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'border-red-500 text-white bg-white/5 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <Icon className="w-4 h-4 text-red-400" />
              <span>{label}</span>
              {count !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  id === 'orders' && unreadOrdersCount > 0 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ══════════════════════════════════════════════════════════
            TAB 1: ORDERS MANAGEMENT (طلبات العملاء)
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Orders Header & Search Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-500" />
                    قائمة طلبات الشراء ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    متابعة وتحديث حالة طلبات العملاء وإرسال الإشعارات
                  </p>
                </div>

                {/* Quick Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === 'all'
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    الكل ({orders.length})
                  </button>
                  {ORDER_STATUSES.map((st) => {
                    const count = orders.filter((o) => (o.status || '').toLowerCase() === st.value).length;
                    return (
                      <button
                        key={st.value}
                        onClick={() => setOrderStatusFilter(st.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          orderStatusFilter === st.value
                            ? 'bg-red-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="ابحث باسم العميل، رقم الهاتف، أو كود الطلب..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
                {orderSearch && (
                  <button
                    onClick={() => setOrderSearch('')}
                    className="absolute left-3 top-3 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Orders List / Cards */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const isNew = Boolean(order.isNew);

                  return (
                    <div
                      key={order.orderId}
                      className={`bg-slate-950 border rounded-2xl p-4 sm:p-6 transition-all space-y-4 ${
                        isNew
                          ? 'border-red-500/70 shadow-lg shadow-red-950/40 bg-red-950/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm sm:text-base text-white tracking-wider">
                            {order.orderId}
                          </span>
                          {isNew && (
                            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md animate-pulse">
                              طلب جديد 🔔
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">
                            {order.date} · {order.time}
                          </span>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 hidden sm:inline">الحالة:</span>
                          <select
                            value={(order.status || 'pending').toLowerCase()}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                            className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer shadow-sm ${statusInfo.color}`}
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st.value} value={st.value} className="bg-slate-900 text-white font-bold">
                                {st.label} ({st.en})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Customer & Delivery Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Customer */}
                        <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">بيانات العميل</span>
                          <div className="font-black text-sm text-white">{order.customerName || 'عميل المتجر'}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <a
                              href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`مرحباً ${order.customerName}، بخصوص طلبكم رقم ${order.orderId} من أليف بيتس 🐾`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-emerald-400 hover:underline font-bold"
                            >
                              {order.customerPhone} (واتساب 💬)
                            </a>
                          </div>
                        </div>

                        {/* Address & GPS */}
                        <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">عنوان التوصيل</span>
                          <div className="text-slate-200 font-bold leading-relaxed">{order.address || 'القاهرة'}</div>
                          {order.mapsUrl && (
                            <a
                              href={order.mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold pt-1 text-[11px]"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              عرض الموقع على الخريطة GPS
                            </a>
                          )}
                        </div>

                        {/* Payment & Delivery Slot */}
                        <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">الدفع والتوصيل</span>
                          <div className="text-slate-200 font-bold">
                            طريقة الدفع: {order.paymentMethod === 'cod' ? '💵 دفع عند الاستلام' : '💳 كارت / أونلاين'}
                          </div>
                          <div className="text-slate-300 text-[11px]">
                            الموعد: {order.deliverySlot === 'express' ? '⚡ توصيل سريع فوري' : order.deliverySlot}
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="bg-slate-900/50 rounded-xl p-3.5 border border-slate-800/80 space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">المنتجات المطلوبة:</span>
                        <div className="space-y-2">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs gap-3 py-1 border-b border-slate-800/60 last:border-0">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={item.product?.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                                />
                                <div className="truncate">
                                  <div className="font-bold text-white truncate">
                                    {item.product?.arabicName || item.product?.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {item.product?.brand} · {item.product?.weight}
                                  </div>
                                </div>
                              </div>
                              <div className="text-left shrink-0 font-bold">
                                <span className="text-slate-400">الكمية: {item.quantity} × </span>
                                <span className="text-red-400 font-black">
                                  {(item.product?.price * item.quantity).toFixed(0)} ج.م
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Totals Summary */}
                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          <div className="text-slate-400 space-x-3 rtl:space-x-reverse">
                            <span>المنتجات: {order.subtotal || order.totalAmount} ج.م</span>
                            {order.discount > 0 && <span className="text-emerald-400">خصم: -{order.discount} ج.م</span>}
                            <span>الشحن: {order.shippingFee === 0 ? 'مجاني' : `${order.shippingFee} ج.م`}</span>
                          </div>
                          <div className="text-sm font-black text-white">
                            الإجمالي النهائي: <span className="text-red-400 text-base">{order.totalAmount} ج.م</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`السلام عليكم أستاذ ${order.customerName}، تم تأكيد طلبكم رقم ${order.orderId} من أليف بيتس وهو الآن ${statusInfo.label}. شكراً لتسوقكم معنا 🐾`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            مراسلة العميل على واتساب
                          </a>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الطلب رقم ${order.orderId}؟`)) {
                              deleteOrder(order.orderId);
                            }
                          }}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors text-xs flex items-center gap-1"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">حذف</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-white">لا توجد طلبات مطابقة</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  لم يتم العثور على أي طلبات تطابق الفلتر المختار حالياً.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: PRODUCTS MANAGEMENT (إدارة المنتجات والمخزن)
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Products Header & Controls */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    كتالوج المنتجات والمخزون ({products.length} منتج)
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    إضافة وتعديل المنتجات، رفع الصور، وتحديد الأسعار وحالة التوفر بالمخزن
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-red-900/40 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة منتج جديد
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد استعادة المنتجات الافتراضية؟')) {
                        resetProductsToDefault();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs"
                    title="استعادة المنتجات الافتراضية"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="ابحث باسم المنتج، الماركة..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                {/* Category Select */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">جميع الأقسام</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-black uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5">المنتج والصورة</th>
                      <th className="p-3.5">القسم والماركة</th>
                      <th className="p-3.5">السعر</th>
                      <th className="p-3.5 text-center">حالة المخزن (Stock)</th>
                      <th className="p-3.5 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => {
                      const inStock = p.inStock !== false;

                      return (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm line-clamp-1">{p.arabicName || p.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{p.name}</div>
                              {p.isBestSeller && (
                                <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black px-1.5 py-0.2 rounded mt-0.5">
                                  الأكثر مبيعاً ⭐
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-200">{p.brand || 'أليف بيتس'}</div>
                            <div className="text-[11px] text-slate-400">{p.weight || 'حجم قياسي'}</div>
                          </td>

                          {/* Price */}
                          <td className="p-3.5 font-bold">
                            <div className="text-sm font-black text-red-400">{p.price} ج.م</div>
                            {p.originalPrice && (
                              <div className="text-[10px] text-slate-500 line-through">{p.originalPrice} ج.م</div>
                            )}
                          </td>

                          {/* Stock Toggle Switch */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => toggleProductStock(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
                                inStock
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                              }`}
                              title="اضغط للتغيير الفوري"
                            >
                              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span>{inStock ? 'متوفر بالمخزن' : 'نفذت الكمية'}</span>
                            </button>
                          </td>

                          {/* Edit / Delete Buttons */}
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all"
                                title="تعديل المنتج"
                              >
                                <Edit3 className="w-4 h-4 text-blue-400" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`هل أنت متأكد من حذف المنتج "${p.arabicName || p.name}"؟`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3: ANALYTICS & STATS (الإحصائيات والمبيعات)
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">إجمالي المبيعات</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{totalRevenue.toFixed(0)} ج.م</div>
                <p className="text-[10px] text-emerald-400 font-bold">من إجمالي الطلبات المؤكدة</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">إجمالي عدد الطلبات</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{totalOrdersCount} طلب</div>
                <p className="text-[10px] text-blue-400 font-bold">من الموقع والواتساب</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">المنتجات المتوفرة</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{inStockCount} منتج</div>
                <p className="text-[10px] text-purple-400 font-bold">جاهز للشحن الفوري</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">المنتجات غير المتوفرة</span>
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{outOfStockCount} منتج</div>
                <p className="text-[10px] text-red-400 font-bold">تحتاج لإعادة تزويد المخزن</p>
              </div>

            </div>

            {/* Quick Status Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-black text-white">توزيع حالات الطلبات الحالية</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {ORDER_STATUSES.map((st) => {
                  const count = orders.filter((o) => (o.status || '').toLowerCase() === st.value).length;
                  return (
                    <div key={st.value} className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800 space-y-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${st.dot} mx-auto mb-1`} />
                      <div className="text-xl font-black text-white">{count}</div>
                      <div className="text-[11px] font-bold text-slate-400">{st.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4: SETTINGS (إعدادات المتجر)
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-red-500" />
                إعدادات متجر أليف بيتس
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                تحديث أرقام الواتساب، مصاريف الشحن، وكلمة مرور لوحة التحكم
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* WhatsApp Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم واتساب الأساسي (Phone 1)</label>
                  <input
                    type="text"
                    value={settingsPhone1}
                    onChange={(e) => setSettingsPhone1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم واتساب الثانوي (Phone 2)</label>
                  <input
                    type="text"
                    value={settingsPhone2}
                    onChange={(e) => setSettingsPhone2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>

              {/* Free Shipping & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">حد الشحن المجاني (جنيه)</label>
                  <input
                    type="number"
                    value={settingsFreeShipping}
                    onChange={(e) => setSettingsFreeShipping(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">مواعيد التوصيل اليومية</label>
                  <input
                    type="text"
                    value={settingsDeliveryHours}
                    onChange={(e) => setSettingsDeliveryHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>

              {/* Change Password */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">تغيير كلمة مرور لوحة التحكم (Admin Password)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="اتركها فارغة إذا كنت لا تريد التغيير"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-3 rounded-xl shadow-lg shadow-red-900/40 text-sm transition-all"
              >
                حفظ التعديلات
              </button>

            </form>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════
          MODAL: ADD / EDIT PRODUCT
      ══════════════════════════════════════════════════════════ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للكتالوج'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  أدخل تفاصيل المنتج والصور والأسعار وتوفر المخزون
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">اسم المنتج بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={productForm.arabicName}
                    onChange={(e) => setProductForm((p) => ({ ...p, arabicName: e.target.value }))}
                    placeholder="مثال: رويال كانين طعام جاف للقطط 2 كجم"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">الاسم بالإنجليزية (اختياري)</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Royal Canin Fit 32 2kg"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">السعر الحالي (جنيه) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="490"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    step="any"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm((p) => ({ ...p, originalPrice: e.target.value }))}
                    placeholder="580"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">الوزن / الحجم</label>
                  <input
                    type="text"
                    value={productForm.weight}
                    onChange={(e) => setProductForm((p) => ({ ...p, weight: e.target.value }))}
                    placeholder="2 كجم / 12 لتر"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>

              {/* Category, Species, Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">القسم (Category)</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">نوع الحيوان (Species)</label>
                  <select
                    value={productForm.species}
                    onChange={(e) => setProductForm((p) => ({ ...p, species: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold cursor-pointer"
                  >
                    {SPECIES_LIST.map((sp) => (
                      <option key={sp.id} value={sp.id}>{sp.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">الماركة (Brand)</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm((p) => ({ ...p, brand: e.target.value }))}
                    placeholder="Royal Canin, Purina..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>

              {/* Image Upload & URL with Live Preview */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="block font-bold text-slate-300">صورة المنتج (رفع من الجهاز أو رابط)</span>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 space-y-2 w-full">
                    {/* File picker */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-red-400" />
                      اختر صورة من جهازك (Upload Image)
                    </button>

                    {/* Or URL */}
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => {
                        setProductForm((p) => ({ ...p, image: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      placeholder="أو الصق رابط الصورة مباشرة (Image URL)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">وصف المنتج</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="وصف تفصيلي للفوائد وطبيعة المنتج..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              {/* Toggles: In Stock & Best Seller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm((p) => ({ ...p, inStock: e.target.checked }))}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-white">متوفر بالمخزن (In Stock)</div>
                    <div className="text-[10px] text-slate-400">إتاحة المنتج للطلب من العملاء</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm((p) => ({ ...p, isBestSeller: e.target.checked }))}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-white">تمييز كـ "الأكثر مبيعاً"</div>
                    <div className="text-[10px] text-slate-400">إظهاره في شريط الصدارة بالموقع</div>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-3 rounded-xl shadow-lg shadow-red-900/40 transition-all text-sm"
                >
                  {editingProductId ? 'حفظ التعديلات' : 'إضافة المنتج للكتالوج'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
