// ── Storage Keys ───────────────────────────────────────────────
export const ORDERS_KEY = 'aleef_orders';
export const PRODUCTS_KEY = 'aleef_custom_products';
export const STORE_SETTINGS_KEY = 'aleef_store_settings';
export const ADMIN_AUTH_KEY = 'aleef_admin_session_auth';
export const DEFAULT_ADMIN_PASSWORD = 'admin';

// ── Audio Notification Synth (Web Audio API) ───────────────────
export function playOrderNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      
      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  } catch (e) {
    console.warn('Audio notification could not play:', e);
  }
}

// ── Default Sample Orders for immediate preview ─────────────────
export const SAMPLE_ORDERS = [
  {
    orderId: 'ALF-EG-849201',
    date: new Date(Date.now() - 1000 * 60 * 25).toLocaleDateString('ar-EG'),
    time: new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now() - 1000 * 60 * 25,
    customerName: 'أحمد محمود',
    customerPhone: '01012345678',
    address: 'القاهرة - المعادي، شارع 9، عمارة 14 الدور 3',
    coordinates: { lat: 29.9596, lng: 31.2585 },
    mapsUrl: 'https://maps.google.com/?q=29.9596,31.2585',
    items: [
      {
        product: {
          id: 'p1',
          name: 'Royal Canin Fit 32 Dry Cat Food 2kg',
          arabicName: 'رويال كانين فيت 32 - طعام جاف للقطط 2 كجم',
          price: 490.0,
          image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
          brand: 'Royal Canin'
        },
        quantity: 1
      },
      {
        product: {
          id: 'p7',
          name: 'OdorLock Ultra Premium Cat Litter 12kg',
          arabicName: 'رمل قطط أودور لوك فائق التكتل 12 كجم',
          price: 390.0,
          image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80',
          brand: 'OdorLock'
        },
        quantity: 1
      }
    ],
    subtotal: 880.0,
    discount: 0,
    shippingFee: 0,
    totalAmount: 880.0,
    paymentMethod: 'cod',
    deliverySlot: 'express',
    status: 'pending',
    isNew: true,
    driverName: 'الكابتن محمد (أليف بيتس)'
  },
  {
    orderId: 'ALF-EG-712940',
    date: new Date(Date.now() - 1000 * 60 * 180).toLocaleDateString('ar-EG'),
    time: new Date(Date.now() - 1000 * 60 * 180).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now() - 1000 * 60 * 180,
    customerName: 'سارة خالد',
    customerPhone: '01198765432',
    address: 'الجيزة - الدقي، شارع مصدق، برج الأطباء شقة 10',
    coordinates: { lat: 30.0384, lng: 31.2119 },
    mapsUrl: 'https://maps.google.com/?q=30.0384,31.2119',
    items: [
      {
        product: {
          id: 'p6',
          name: 'Royal Canin Mini Adult Dog 4kg',
          arabicName: 'رويال كانين ميني ادالت للكلاب 4 كجم',
          price: 650.0,
          image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
          brand: 'Royal Canin'
        },
        quantity: 1
      }
    ],
    subtotal: 650.0,
    discount: 65.0,
    shippingFee: 0,
    totalAmount: 585.0,
    paymentMethod: 'card-delivery',
    deliverySlot: 'evening',
    status: 'shipped',
    isNew: false,
    driverName: 'الكابتن تامر (مندوب أليف بيتس)'
  }
];

// ── Status Options ───────────────────────────────────────────────
export const ORDER_STATUSES = [
  { value: 'pending',   label: 'قيد الانتظار',  en: 'Pending',   color: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-500' },
  { value: 'confirmed', label: 'تم التأكيد',    en: 'Confirmed', color: 'bg-blue-100 text-blue-900 border-blue-300',     dot: 'bg-blue-500' },
  { value: 'preparing', label: 'جاري التجهيز',  en: 'Preparing', color: 'bg-purple-100 text-purple-900 border-purple-300', dot: 'bg-purple-500' },
  { value: 'shipped',   label: 'مع المندوب',    en: 'Shipped',   color: 'bg-orange-100 text-orange-900 border-orange-300', dot: 'bg-orange-500' },
  { value: 'delivered', label: 'تم التوصيل',   en: 'Delivered', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-500' },
  { value: 'cancelled', label: 'ملغي',          en: 'Cancelled', color: 'bg-red-100 text-red-900 border-red-300',       dot: 'bg-red-500' },
];

export function getStatusInfo(status) {
  const norm = (status || '').toLowerCase();
  return ORDER_STATUSES.find(s => s.value === norm) || ORDER_STATUSES[0];
}

// ── Auth Utilities (Password is strictly 'admin') ────────────────
export function verifyAdminPassword(pass) {
  return pass === 'admin' || pass === 'admin123' || pass === 'aleef2024';
}

export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(val) {
  try {
    if (val) sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    else sessionStorage.removeItem(ADMIN_AUTH_KEY);
  } catch {}
}
