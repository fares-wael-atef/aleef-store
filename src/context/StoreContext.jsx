import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS, STORE_INFO as DEFAULT_STORE_INFO } from '../data/products';
import { 
  ORDERS_KEY, 
  PRODUCTS_KEY, 
  STORE_SETTINGS_KEY, 
  SAMPLE_ORDERS, 
  playOrderNotificationSound 
} from '../admin/adminUtils';
import { translations } from '../data/translations';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // ── 0. Language State (Arabic / English) ────────────────────────
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('aleef_language') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aleef_language', lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback((key) => {
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    if (translations.ar && translations.ar[key] !== undefined) {
      return translations.ar[key];
    }
    return key;
  }, [language]);

  // ── 1. Products State (Custom/Admin + Default) ──────────────────
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch (e) {
      console.error('Failed to parse products from localStorage:', e);
      return DEFAULT_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  // ── 2. Store Info / Settings State ──────────────────────────────
  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORE_SETTINGS_KEY);
      return saved ? { ...DEFAULT_STORE_INFO, ...JSON.parse(saved) } : DEFAULT_STORE_INFO;
    } catch (e) {
      return DEFAULT_STORE_INFO;
    }
  });

  const updateStoreSettings = (newSettings) => {
    setStoreInfo((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // ── 3. Orders State ─────────────────────────────────────────────
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch (e) {
      console.error('Failed to parse orders from localStorage:', e);
      return SAMPLE_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // ── 4. View Mode (Storefront vs Admin Portal) ───────────────────
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'store';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (window.location.hash === '#store' || window.location.pathname === '/') {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const navigateToView = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = 'store';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── 5. Cart & Wishlist State ────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [petProfile, setPetProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_pet_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_location');
      return saved ? JSON.parse(saved) : {
        lat: 30.0444,
        lng: 31.2357,
        addressText: 'القاهرة - مصر',
        city: 'القاهرة',
        district: 'المعادي',
        isDetected: false
      };
    } catch (e) {
      return {
        lat: 30.0444,
        lng: 31.2357,
        addressText: 'القاهرة - مصر',
        city: 'القاهرة',
        district: 'المعادي',
        isDetected: false
      };
    }
  });

  // ── UI Modals ───────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPetProfileOpen, setIsPetProfileOpen] = useState(false);
  const [isFoodCalcOpen, setIsFoodCalcOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // ── Filter & Search State ───────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(2000);

  // ── Coupon State ────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Toast System ────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    try { localStorage.setItem('aleef_cart', JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('aleef_wishlist', JSON.stringify(wishlist)); } catch (e) {}
  }, [wishlist]);

  // ── Product CRUD Methods ────────────────────────────────────────
  const addProduct = (productData) => {
    const newProduct = {
      id: 'prod_' + Date.now(),
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      isBestSeller: false,
      dietary: [],
      ...productData,
      price: parseFloat(productData.price) || 0,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(language === 'ar' ? `تمت إضافة "${newProduct.arabicName || newProduct.name}" بنجاح!` : `Added "${newProduct.name}" successfully!`);
    return newProduct;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...updatedFields,
              price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : p.price,
              originalPrice: updatedFields.originalPrice ? parseFloat(updatedFields.originalPrice) : p.originalPrice
            }
          : p
      )
    );
    showToast(language === 'ar' ? 'تم تحديث بيانات المنتج بنجاح!' : 'Product updated successfully!');
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(language === 'ar' ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!', 'info');
  };

  const toggleProductStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = !p.inStock;
          const statusText = nextStock ? (language === 'ar' ? 'متوفر' : 'In Stock') : (language === 'ar' ? 'نفذت الكمية' : 'Out of Stock');
          showToast(`${language === 'ar' ? 'تم تعديل الحالة إلى: ' : 'Status changed to: '} ${statusText}`);
          return { ...p, inStock: nextStock };
        }
        return p;
      })
    );
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.removeItem(PRODUCTS_KEY);
    showToast(language === 'ar' ? 'تمت استعادة المنتجات الأصلية!' : 'Restored original products!');
  };

  // ── Order Management Methods ────────────────────────────────────
  const createOrder = (orderData) => {
    const orderId = orderData.orderId || `ALF-EG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...orderData,
      orderId,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      isNew: true,
    };

    setOrders((prev) => [newOrder, ...prev]);
    playOrderNotificationSound();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus, isNew: false } : o))
    );
    showToast(language === 'ar' ? `تم تغيير حالة الطلب ${orderId} إلى: ${newStatus}` : `Order ${orderId} status updated to: ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    showToast(language === 'ar' ? `تم حذف الطلب ${orderId}` : `Order ${orderId} deleted`, 'info');
  };

  const markAllOrdersSeen = () => {
    setOrders((prev) => prev.map((o) => ({ ...o, isNew: false })));
  };

  const unreadOrdersCount = orders.filter((o) => o.isNew || o.status === 'pending').length;

  // ── Cart Operations ─────────────────────────────────────────────
  const addToCart = (product, qty = 1) => {
    if (product.inStock === false) {
      showToast(language === 'ar' ? 'عذراً، هذا المنتج غير متوفر حالياً بالمخزن' : 'Sorry, this product is currently out of stock', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    const pName = language === 'ar' ? (product.arabicName || product.name) : product.name;
    showToast(language === 'ar' ? `تمت إضافة "${pName}" للسلة 🛍️` : `Added "${pName}" to cart! 🛍️`);
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(language === 'ar' ? 'تم حذف المنتج من السلة' : 'Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'ar' ? 'تمت الإضافة للمفضلة ❤️' : 'Added to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  // ── Coupon Logic ────────────────────────────────────────────────
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (storeInfo.coupons && storeInfo.coupons[cleanCode]) {
      setAppliedCoupon(cleanCode);
      showToast(language === 'ar' ? `تم تفعيل كود الخصم "${cleanCode}" بنجاح!` : `Coupon "${cleanCode}" applied! 🎉`);
      return true;
    } else {
      showToast(language === 'ar' ? 'كود الخصم غير صالح' : 'Invalid coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast(language === 'ar' ? 'تم إزالة كود الخصم' : 'Coupon removed');
  };

  // ── Totals Calculation ──────────────────────────────────────────
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  let isFreeShippingCoupon = false;

  if (appliedCoupon && storeInfo.coupons && storeInfo.coupons[appliedCoupon]) {
    const couponVal = storeInfo.coupons[appliedCoupon];
    if (couponVal === 'FREE_SHIPPING') {
      isFreeShippingCoupon = true;
    } else if (typeof couponVal === 'number') {
      discount = subtotal * couponVal;
    }
  }

  const isFreeShipping = subtotal >= (storeInfo.freeShippingThreshold || 500) || isFreeShippingCoupon;
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 35.0);
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Location Helpers ────────────────────────────────────────────
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      showToast(language === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation is not supported', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          addressText: `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          city: 'Cairo',
          district: 'Current Location',
          isDetected: true
        });
        showToast(language === 'ar' ? 'تم تحديد موقعك بدقة GPS بنجاح!' : 'Location detected via GPS! 📍');
      },
      (err) => {
        showToast(language === 'ar' ? 'تعذر الوصول للموقع، يرجى كتابة العنوان يدوياً' : 'Could not detect location. Please enter address manually', 'info');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ── WhatsApp Message Builder ────────────────────────────────────
  const buildWhatsAppOrderMessage = (customerInfo, orderCart, finalTotal, loc) => {
    let msg = `*🐾 New Order - Aleef Pets | أليف بيتس 🐾*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Customer:* ${customerInfo.name || 'Customer'}\n`;
    msg += `📱 *Phone:* ${customerInfo.phone || 'N/A'}\n`;
    msg += `📍 *Address:* ${customerInfo.address || 'Egypt'}\n`;
    if (loc && loc.lat && loc.lng) {
      msg += `🗺️ *GPS Location:* https://maps.google.com/?q=${loc.lat},${loc.lng}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📦 *Order Items:*\n`;

    orderCart.forEach((item, idx) => {
      const pName = language === 'ar' ? (item.product.arabicName || item.product.name) : item.product.name;
      msg += `${idx + 1}. *${pName}*\n`;
      msg += `   • Qty: ${item.quantity} | Price: ${(item.product.price * item.quantity).toFixed(0)} EGP\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💵 *Total Amount:* ${finalTotal.toFixed(0)} EGP\n`;
    msg += `🚚 *Delivery:* ${isFreeShipping ? 'Free Shipping' : '35 EGP'}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please confirm order receipt. Thank you for shopping with Aleef Pets! 🐾`;

    return encodeURIComponent(msg);
  };

  const value = {
    // Language
    language,
    setLanguage,
    toggleLanguage,
    t,
    isArabic: language === 'ar',

    // Products
    PRODUCTS: products,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    resetProductsToDefault,

    // Store Info
    STORE_INFO: storeInfo,
    storeInfo,
    updateStoreSettings,

    // Orders
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    markAllOrdersSeen,
    unreadOrdersCount,

    // Views
    currentView,
    setCurrentView: navigateToView,
    navigateToView,

    // Cart & Wishlist
    cart,
    wishlist,
    petProfile,
    userLocation,
    isCartOpen,
    isCheckoutOpen,
    isPetProfileOpen,
    isFoodCalcOpen,
    selectedProductDetail,
    isOrderTrackingOpen,
    activeOrder,
    searchQuery,
    selectedSpecies,
    selectedCategory,
    sortBy,
    priceRange,
    couponCode,
    appliedCoupon,
    toasts,
    subtotal,
    discount,
    shippingFee,
    isFreeShipping,
    totalAmount,
    totalItemsCount,
    setCart,
    setWishlist,
    setPetProfile,
    setUserLocation,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsPetProfileOpen,
    setIsFoodCalcOpen,
    setSelectedProductDetail,
    setIsOrderTrackingOpen,
    setActiveOrder,
    setSearchQuery,
    setSelectedSpecies,
    setSelectedCategory,
    setSortBy,
    setPriceRange,
    setCouponCode,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    applyCoupon,
    removeCoupon,
    detectUserLocation,
    buildWhatsAppOrderMessage,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
