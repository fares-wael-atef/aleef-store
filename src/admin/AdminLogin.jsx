import React, { useState } from 'react';
import { adminLogin } from './adminUtils';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (adminLogin(password)) {
        onLogin();
      } else {
        setError('كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <svg viewBox="0 0 100 100" className="w-10 h-10 fill-red-500">
              <path d="M50 42 C38 42 27 50 23 62 C18 76 20 87 31 90 C38 92.5 44.5 89 50 89 C55.5 89 62 92.5 69 90 C80 87 82 76 77 62 C73 50 62 42 50 42Z" />
              <ellipse cx="18" cy="42" rx="11" ry="16" transform="rotate(-35 18 42)" />
              <ellipse cx="36" cy="22" rx="11" ry="17" transform="rotate(-12 36 22)" />
              <ellipse cx="64" cy="22" rx="11" ry="17" transform="rotate(12 64 22)" />
              <ellipse cx="82" cy="42" rx="11" ry="16" transform="rotate(35 82 42)" />
            </svg>
            <div className="text-right">
              <div className="text-xl font-black text-white leading-none">Aleef Pets</div>
              <div className="text-xs text-slate-500 font-medium">لوحة تحكم المتجر</div>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل الدخول</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">أدخل كلمة مرور المدير للمتابعة</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium text-sm"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl transition-all text-sm"
          >
            {loading ? 'جاري التحقق...' : 'دخول للوحة التحكم'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-xs font-medium transition-colors">
            العودة للمتجر
          </a>
        </div>

      </div>
    </div>
  );
}
