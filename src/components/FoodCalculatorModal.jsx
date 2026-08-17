import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calculator, ShoppingBag, CheckCircle, Sparkles, Scale, Info } from 'lucide-react';

export default function FoodCalculatorModal() {
  const { isFoodCalcOpen, setIsFoodCalcOpen, PRODUCTS, addToCart, showToast } = useStore();

  const [petType, setPetType] = useState('cat');
  const [weightKg, setWeightKg] = useState(4.0);
  const [activity, setActivity] = useState('moderate'); // indoor, moderate, active

  if (!isFoodCalcOpen) return null;

  // Food calculation algorithm
  // Base daily intake factor:
  // Cat: ~13.5g per kg for moderate activity
  // Dog: ~15g per kg for moderate activity
  let factor = petType === 'cat' ? 13.5 : 15.0;
  if (activity === 'indoor') factor *= 0.85;
  if (activity === 'active') factor *= 1.25;

  const dailyGrams = Math.round(weightKg * factor);
  const monthlyKg = ((dailyGrams * 30) / 1000).toFixed(2);
  const daysPerBag4kg = Math.round(4000 / (dailyGrams || 1));

  // Find matching product
  const recommendedProduct = PRODUCTS.find(
    (p) => p.species === petType && p.category === 'dry-food'
  ) || PRODUCTS[0];

  const handleAddRecommended = () => {
    addToCart(recommendedProduct, 1);
    setIsFoodCalcOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 p-5 text-slate-950 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl">
              <Calculator className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Pet Food Portion Calculator</h3>
              <p className="text-xs font-semibold text-slate-800">Calculate exact daily intake & 30-day bag needs</p>
            </div>
          </div>
          <button
            onClick={() => setIsFoodCalcOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center font-bold text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          {/* Controls Grid */}
          <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
            
            {/* Pet Type */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                Pet Species
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPetType('cat')}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                    petType === 'cat'
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-lg">🐱</span>
                  <span>Cat</span>
                </button>
                <button
                  onClick={() => setPetType('dog')}
                  className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                    petType === 'dog'
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-lg">🐶</span>
                  <span>Dog</span>
                </button>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase">
                  Body Weight: <span className="text-amber-700 text-sm font-black">{weightKg} kg</span>
                </label>
              </div>
              <input
                type="range"
                min="0.5"
                max={petType === 'cat' ? 12 : 50}
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-amber-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                Activity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'indoor', label: 'Indoor / Calm' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'active', label: 'Very Active' }
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setActivity(act.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activity === act.id
                        ? 'bg-amber-400 border-amber-500 text-slate-950'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-4 rounded-2xl text-slate-950 shadow-md">
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-950/20">
              <div>
                <p className="text-[10px] uppercase font-black text-slate-800">Daily Intake</p>
                <p className="text-2xl font-black">{dailyGrams} <span className="text-xs">g/day</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-800">Monthly Need</p>
                <p className="text-2xl font-black">{monthlyKg} <span className="text-xs">kg</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-800">4kg Bag Lasts</p>
                <p className="text-2xl font-black">~{daysPerBag4kg} <span className="text-xs">days</span></p>
              </div>
            </div>
          </div>

          {/* Recommended Product Box */}
          {recommendedProduct && (
            <div className="border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between bg-amber-50/30">
              <div className="flex items-center space-x-3">
                <img
                  src={recommendedProduct.image}
                  alt={recommendedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-amber-200 shrink-0"
                />
                <div>
                  <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    Recommended Match
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5">
                    {recommendedProduct.name}
                  </p>
                  <p className="text-xs font-bold text-amber-700">
                    ${recommendedProduct.price.toFixed(2)} ({recommendedProduct.weight})
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddRecommended}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold p-2.5 rounded-xl text-xs flex items-center space-x-1 shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
