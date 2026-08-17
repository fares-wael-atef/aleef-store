import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, STORE_INFO } from '../data/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Cart state with safe parsing
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Wishlist state with safe parsing
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage:', e);
      return [];
    }
  });

  // Pet Profile state with safe parsing
  const [petProfile, setPetProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_pet_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse pet profile from localStorage:', e);
      return null;
    }
  });

  // User location state with safe parsing
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('aleef_location');
      return saved ? JSON.parse(saved) : {
        lat: 24.7136,
        lng: 46.6753,
        addressText: 'Riyadh, Saudi Arabia',
        city: 'Riyadh',
        district: 'Olaya',
        isDetected: false
      };
    } catch (e) {
      console.error('Failed to parse location from localStorage:', e);
      return {
        lat: 24.7136,
        lng: 46.6753,
        addressText: 'Riyadh, Saudi Arabia',
        city: 'Riyadh',
        district: 'Olaya',
        isDetected: false
      };
    }
  });

  // UI Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPetProfileOpen, setIsPetProfileOpen] = useState(false);
  const [isFoodCalcOpen, setIsFoodCalcOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(100);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('aleef_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aleef_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    if (petProfile) {
      try {
        localStorage.setItem('aleef_pet_profile', JSON.stringify(petProfile));
      } catch (e) {}
    }
  }, [petProfile]);

  useEffect(() => {
    if (userLocation) {
      try {
        localStorage.setItem('aleef_location', JSON.stringify(userLocation));
      } catch (e) {}
    }
  }, [userLocation]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (product, qty = 1) => {
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
    showToast(`Added "${product.name}" to cart! 🐾`);
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
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (STORE_INFO.coupons[cleanCode]) {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon "${cleanCode}" applied successfully! 🎉`);
      return true;
    } else {
      showToast('Invalid promo code. Try ALEEF10', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Coupon removed');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discount = 0;
  let isFreeShipping = subtotal >= STORE_INFO.freeShippingThreshold;

  if (appliedCoupon === 'ALEEF10') {
    discount = subtotal * 0.10;
  } else if (appliedCoupon === 'ALEEF20') {
    discount = subtotal * 0.20;
  } else if (appliedCoupon === 'FREESHIP') {
    isFreeShipping = true;
  }

  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 5.00;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Location Geolocation helper
  const detectUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error');
        reject(new Error('Geolocation not supported'));
        return;
      }

      showToast('Detecting your GPS location...', 'info');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const newLoc = {
            lat,
            lng,
            addressText: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            city: 'Your City',
            district: 'Detected Area',
            isDetected: true,
            mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
          };
          setUserLocation(newLoc);
          showToast('GPS location acquired! 📍');
          resolve(newLoc);
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          showToast('Could not auto-detect GPS location. You can select it on the map.', 'error');
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // WhatsApp Order message builder (Aleef Pets Egypt)
  const buildWhatsAppOrderMessage = (customerInfo, orderItems, total, loc) => {
    let msg = `🐾 *طلب جديد من متجر أليف بيتس (Aleef Pets 🇪🇬)*\n`;
    msg += `====================================\n`;
    msg += `👤 *اسم العميل:* ${customerInfo.name || 'عميل كريم'}\n`;
    msg += `📞 *رقم الهاتف:* ${customerInfo.phone || 'غير محدد'}\n`;
    msg += `📍 *عنوان التوصيل:* ${customerInfo.address || loc.addressText}\n`;
    if (loc.lat && loc.lng) {
      msg += `🗺️ *موقع الـ GPS على الخريطة:* https://maps.google.com/?q=${loc.lat},${loc.lng}\n`;
    }
    msg += `====================================\n`;
    msg += `🛒 *المنتجات المطلوبة:*\n`;
    orderItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.arabicName || item.product.name} (عدد: ${item.quantity}) - ${(item.product.price * item.quantity).toFixed(2)} ج.م\n`;
    });
    msg += `====================================\n`;
    msg += `💵 *المجموع الفرعي:* ${subtotal.toFixed(2)} ج.م\n`;
    if (discount > 0) msg += `🏷️ *الخصم:* -${discount.toFixed(2)} ج.م\n`;
    msg += `🚚 *الشحن والتوصيل:* ${shippingFee === 0 ? 'مجاناً ⚡' : `${shippingFee.toFixed(2)} ج.م`}\n`;
    msg += `💰 *الإجمالي النهائي للدفع:* *${total.toFixed(2)} ج.م*\n`;
    msg += `====================================\n`;
    msg += `⚡ برجاء تأكيد الطلب وتحديد موعد وصول المندوب. شكراً لتسوقكم مع أليف بيتس! 🐾`;

    return encodeURIComponent(msg);
  };

  const value = {
    PRODUCTS,
    STORE_INFO,
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
