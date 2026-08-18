import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ORDER_STATUSES, 
  getStatusInfo, 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  verifyAdminPassword
} from './adminUtils';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  LogOut, 
  Store, 
  X, 
  Upload, 
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Eye
} from 'lucide-react';
import { CATEGORIES, SPECIES_LIST } from '../data/products';

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    orders,
    updateOrderStatus,
    deleteOrder,
    navigateToView,
    showToast
  } = useStore();

  // ── Auth State ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // ── Navigation Tabs ('dashboard' | 'products' | 'orders') ──
  const [activeTab, setActiveTab] = useState('products');

  // ── Filter & Search State ──
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // ── Modal State ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ── Product Form ──
  const initialForm = {
    arabicName: '',
    name: '',
    price: '',
    originalPrice: '',
    category: 'dry-food',
    species: 'cat',
    brand: 'أليف بيتس',
    weight: '1 كجم',
    inStock: true,
    image: '',
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // ── Auth Handlers ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(loginPass)) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Welcome to Aleef Admin!');
    } else {
      setLoginError('Incorrect password. Password is: admin');
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setLoginPass('');
    showToast('Logged out successfully');
  };

  const handleViewStore = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setLoginPass('');
    navigateToView('store');
  };

  // ── Product Handlers ──
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      arabicName: p.arabicName || '',
      name: p.name || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      category: p.category || 'dry-food',
      species: p.species || 'cat',
      brand: p.brand || 'أليف بيتس',
      weight: p.weight || '1 كجم',
      inStock: p.inStock !== false,
      image: p.image || '',
      description: p.description || ''
    });
    setImagePreview(p.image || '');
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() && !formData.arabicName.trim()) {
      showToast('Please enter product name', 'error');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    const payload = {
      ...formData,
      arabicName: formData.arabicName || formData.name,
      name: formData.name || formData.arabicName,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      inStock: Boolean(formData.inStock),
      image: imagePreview || formData.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast(`Updated "${payload.name}" — live on storefront!`);
    } else {
      addProduct(payload);
      showToast(`Added "${payload.name}" — live on storefront!`);
    }

    setIsModalOpen(false);
  };

  // ── Calculated Stats ──
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length;
  const outOfStock = products.filter((p) => p.inStock === false).length;

  // ── Filtered Products ──
  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.arabicName || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  // ── Filtered Orders ──
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && (o.status || '').toLowerCase() !== orderStatusFilter.toLowerCase()) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q) ||
        (o.orderId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── 1. LIGHT MODE LOGIN VIEW (LTR) ──
  if (!isAuthenticated) {
    return (
      <div dir="ltr" className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-emerald-800">
                <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
                <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
                <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
                <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
                <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Aleef Admin</h1>
            <p className="text-xs text-slate-500">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter password (default: admin)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#13392a] hover:bg-[#0e2a1e] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
            >
              Sign In
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => navigateToView('store')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. LIGHT MODE ADMIN PORTAL (EXPLICIT LTR) ──
  return (
    <div dir="ltr" className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800 flex text-left">
      
      {/* ── Left Sidebar ── */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
        
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#13392a]">
            <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
            <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
            <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
            <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
            <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
          </svg>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Aleef Admin</span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'dashboard'
                ? 'bg-[#13392a] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'products'
                ? 'bg-[#13392a] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'orders'
                ? 'bg-[#13392a] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </div>
            {pendingOrders > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingOrders}
              </span>
            )}
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={handleViewStore}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
          >
            <Store className="w-4 h-4 text-emerald-700" />
            <span>View Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ── Main Panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 capitalize">
            {activeTab}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              Aleef Store Egypt · Changes save automatically
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 overflow-y-auto space-y-6">

          {/* ═══════════════════════════════════════════════════════
              1. DASHBOARD VIEW
          ═══════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-base font-bold text-slate-900">Welcome back, Admin</h3>
              </div>

              {/* 4 Light Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0">
                    📦
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</div>
                    <div className="text-xl font-bold text-slate-900">{totalProducts}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg shrink-0">
                    🛒
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</div>
                    <div className="text-xl font-bold text-slate-900">{totalOrders}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shrink-0">
                    ⏳
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</div>
                    <div className="text-xl font-bold text-slate-900">{pendingOrders}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center text-lg shrink-0">
                    ⚠️
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</div>
                    <div className="text-xl font-bold text-slate-900">{outOfStock}</div>
                  </div>
                </div>

              </div>

              {/* Recent Orders Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Orders</h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#13392a] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">ORDER ID</th>
                        <th className="p-3.5">CUSTOMER</th>
                        <th className="p-3.5">DATE</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 6).map((order) => {
                        const st = getStatusInfo(order.status);
                        return (
                          <tr key={order.orderId} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-mono font-bold text-slate-900">{order.orderId}</td>
                            <td className="p-3.5 font-medium text-slate-800">{order.customerName}</td>
                            <td className="p-3.5 text-slate-500">{order.date}</td>
                            <td className="p-3.5">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${st.color}`}>
                                {st.label}
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-bold text-slate-900">{order.totalAmount} ج.م</td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              2. PRODUCTS VIEW (LTR with iPhone Toggle & Real Buttons)
          ═══════════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Top Controls */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900">Products</h3>
                <button
                  onClick={handleOpenAdd}
                  className="bg-[#13392a] hover:bg-[#0e2a1e] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Product</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="max-w-xs">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5 w-16">IMAGE</th>
                        <th className="p-3.5">NAME</th>
                        <th className="p-3.5">CATEGORY</th>
                        <th className="p-3.5">PRICE</th>
                        <th className="p-3.5 text-center w-28">STOCK</th>
                        <th className="p-3.5 text-right w-40">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => {
                        const inStock = p.inStock !== false;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            
                            {/* Image */}
                            <td className="p-3.5">
                              <img
                                src={p.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200"
                              />
                            </td>

                            {/* Name */}
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 leading-tight">{p.name || p.arabicName}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{p.arabicName}</div>
                            </td>

                            {/* Category Pill */}
                            <td className="p-3.5">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {p.category || 'general'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-3.5 font-bold text-slate-900">
                              {p.price.toFixed(2)} ج.م
                            </td>

                            {/* iOS Style iPhone Toggle Switch */}
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => toggleProductStock(p.id)}
                                  className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative flex items-center p-0.5 shadow-inner focus:outline-none ${
                                    inStock ? 'bg-[#34C759]' : 'bg-slate-300'
                                  }`}
                                  title={inStock ? 'In Stock (Click to turn off)' : 'Out of Stock (Click to turn on)'}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                      inStock ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>

                            {/* Actions: Real "Edit" & "Delete" Buttons */}
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(p)}
                                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                                  title="Edit product"
                                >
                                  <Edit3 className="w-3 h-3 text-slate-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${p.name || p.arabicName}"?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
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

          {/* ═══════════════════════════════════════════════════════
              3. ORDERS VIEW (LTR with Status & Actions)
          ═══════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Header & Filter Dropdown */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900">Orders</h3>
                
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-sm"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  {ORDER_STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.en} / {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">ORDER ID</th>
                        <th className="p-3.5">CUSTOMER</th>
                        <th className="p-3.5">DATE</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5">ITEMS</th>
                        <th className="p-3.5 text-right">TOTAL</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((order) => {
                        const st = getStatusInfo(order.status);

                        return (
                          <tr key={order.orderId} className="hover:bg-slate-50/60 transition-colors">
                            
                            {/* Order ID */}
                            <td className="p-3.5 font-mono font-bold text-slate-900">
                              {order.orderId}
                              {order.isNew && (
                                <span className="ml-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                            </td>

                            {/* Customer & WhatsApp */}
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{order.customerName}</div>
                              <a
                                href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`مرحباً ${order.customerName}، بخصوص طلبكم ${order.orderId} من أليف بيتس 🐾`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-700 hover:underline font-mono inline-flex items-center gap-1"
                              >
                                💬 {order.customerPhone}
                              </a>
                            </td>

                            {/* Date */}
                            <td className="p-3.5 text-slate-500 whitespace-nowrap">
                              {order.date} {order.time}
                            </td>

                            {/* Status dropdown */}
                            <td className="p-3.5">
                              <select
                                value={(order.status || 'pending').toLowerCase()}
                                onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${st.color}`}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.en} ({s.label})
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Items count summary */}
                            <td className="p-3.5 text-slate-600">
                              {(order.items || []).length} item(s)
                            </td>

                            {/* Total */}
                            <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                              {order.totalAmount} ج.م
                            </td>

                            {/* Actions: Real "Delete" button */}
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete order ${order.orderId}?`)) {
                                    deleteOrder(order.orderId);
                                  }
                                }}
                                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          LIGHT MODAL: ADD / EDIT PRODUCT
      ═══════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div dir="ltr" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              {/* Product Names */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Royal Canin Cat Food 2kg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المنتج بالعربية (Arabic Name)</label>
                <input
                  type="text"
                  value={formData.arabicName}
                  onChange={(e) => setFormData((p) => ({ ...p, arabicName: e.target.value }))}
                  placeholder="مثال: طعام قطط رويال كانين 2 كجم"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  dir="rtl"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (ج.م) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="450"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <label className="block font-bold text-slate-700">Product Image</label>
                
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      Upload File
                    </button>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, image: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Or paste Image URL"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* In-Stock Switch */}
              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800">In Stock (Available for purchase)</div>
                  <div className="text-[10px] text-slate-500">Toggle off to mark as Out of Stock</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData((p) => ({ ...p, inStock: e.target.checked }))}
                  className="w-4 h-4 accent-[#34C759] rounded cursor-pointer"
                />
              </label>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Product details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 bg-[#13392a] hover:bg-[#0e2a1e] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
