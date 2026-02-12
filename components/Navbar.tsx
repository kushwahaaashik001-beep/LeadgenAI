"use client";

import React from 'react';
import { Zap, Crown, Sparkles, TrendingUp, Users } from 'lucide-react';

interface NavbarProps {
  /** Callback when Upgrade to Pro button is clicked – opens Pro modal/pricing */
  onOpenPro: () => void;
  /** Current free credits left (default 3) */
  creditsLeft?: number;
}

export default function Navbar({ 
  onOpenPro, 
  creditsLeft = 3 
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ----- Logo with gradient & icon ----- */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg blur-sm opacity-70" />
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Optima<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Sniper</span>
          </span>
          {/* Small "Beta" badge – optional premium touch */}
          <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            BETA
          </span>
        </div>

        {/* ----- Right Section: Credits + Upgrade + Profile (placeholder) ----- */}
        <div className="flex items-center gap-3">
          
          {/* Free Credits Counter – eye catching with amber gradient */}
          <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-1.5 rounded-full border border-amber-200/70 shadow-sm">
            <div className="relative">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-bold text-amber-700">
              {creditsLeft} {creditsLeft === 1 ? 'Credit' : 'Credits'} Left
            </span>
            {/* Small "Free" tag */}
            <span className="text-[10px] font-medium text-amber-600 bg-amber-200/50 px-1.5 py-0.5 rounded-full">
              FREE
            </span>
          </div>

          {/* Upgrade to Pro Button – shiny & irresistible */}
          <button
            onClick={onOpenPro}
            className="relative group flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Upgrade to Pro</span>
            {/* Animated "Save 50%" badge */}
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
              -50%
            </span>
          </button>

          {/* Profile Avatar – subtle, not main focus */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors">
            <Users className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
    </nav>
  );
}
