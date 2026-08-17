import React, { Component } from 'react';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import Toast from './components/Toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8 flex flex-col items-center justify-center text-center font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-200 max-w-lg w-full space-y-4">
            <div className="text-4xl">🐾</div>
            <h2 className="text-xl font-black text-slate-900">أليف بيتس - تنبيه</h2>
            <p className="text-xs text-slate-600 font-medium">حدث خطأ أثناء التحميل:</p>
            <pre className="bg-slate-900 text-red-400 p-4 rounded-xl text-left text-xs overflow-x-auto">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 text-white font-black px-6 py-2.5 rounded-xl shadow-md text-xs hover:bg-red-700"
            >
              مسح الذاكرة المؤقتة وإعادة التحميل
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white font-sans pb-16 md:pb-0">
          {/* Navigation Bar */}
          <Navbar />

          {/* Hero Banner & Promo Highlights */}
          <HeroBanner />

          {/* Product Catalog Grid */}
          <main className="flex-1">
            <ProductGrid />
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Bottom Quick Navigation Bar */}
          <MobileBottomNav />

          {/* Modals & Overlays */}
          <CartDrawer />
          <CheckoutModal />
          <ProductDetailModal />
          <OrderTrackingModal />

          {/* Floating Widgets */}
          <WhatsAppWidget />
          <Toast />
        </div>
      </StoreProvider>
    </ErrorBoundary>
  );
}
