import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function PetProfileModal() {
  const { isPetProfileOpen, setIsPetProfileOpen, petProfile, setPetProfile, showToast } = useStore();

  const [name, setName] = useState(petProfile?.name || '');
  const [species, setSpecies] = useState(petProfile?.species || 'cat');
  const [weight, setWeight] = useState(petProfile?.weight || 4);
  const [age, setAge] = useState(petProfile?.age || 'Adult');
  const [dietGoal, setDietGoal] = useState(petProfile?.dietGoal || 'Indoor');

  if (!isPetProfileOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your pet name', 'error');
      return;
    }
    const profile = { name: name.trim(), species, weight: Number(weight), age, dietGoal };
    setPetProfile(profile);
    showToast(`Profile created for ${name}! 🐾`);
    setIsPetProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 p-5 text-slate-950 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl">
              🐾
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">My Pet Profile</h3>
              <p className="text-xs font-semibold text-slate-800">Personalized food & supply recommendations</p>
            </div>
          </div>
          <button
            onClick={() => setIsPetProfileOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center font-bold text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Pet Name */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
              Pet's Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milo, Bella, Oscar"
              className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Species Selector */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
              Pet Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cat', label: 'Cat', emoji: '🐱' },
                { id: 'dog', label: 'Dog', emoji: '🐶' },
                { id: 'bird', label: 'Bird', emoji: '🦜' },
                { id: 'fish', label: 'Fish', emoji: '🐠' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSpecies(item.id)}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center space-y-1 transition-all ${
                    species === item.id
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                Life Stage
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="Kitten/Puppy">Kitten / Puppy (&lt; 1 Year)</option>
                <option value="Adult">Adult (1-7 Years)</option>
                <option value="Senior">Senior (&gt; 7 Years)</option>
              </select>
            </div>
          </div>

          {/* Dietary Needs */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
              Dietary Goal / Need
            </label>
            <select
              value={dietGoal}
              onChange={(e) => setDietGoal(e.target.value)}
              className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="Indoor">Indoor & Hairball Control</option>
              <option value="Sterilised">Sterilised & Neutered Care</option>
              <option value="Grain Free">Grain Free & Sensitive Stomach</option>
              <option value="High Protein">High Protein Active</option>
              <option value="Weight Control">Weight Control</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-2xl shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Pet Profile</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
