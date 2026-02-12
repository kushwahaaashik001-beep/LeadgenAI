"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, Bell, Sparkles, CheckCircle, X, TrendingUp, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Premium Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute -bottom-8 left-8">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="px-8 pt-12 pb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Upgrade to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Pro</span>
            </h2>
            <p className="text-slate-600 mb-6">
              Unlock the full power of AI lead generation. Join 500+ freelancers earning 3x more.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className={`p-2 rounded-lg ${benefit.bgColor}`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{benefit.title}</h4>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-sm font-medium text-blue-700 uppercase tracking-wide">Limited Offer</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-slate-900">$19</span>
                    <span className="text-slate-500">/month</span>
                    <span className="text-sm line-through text-slate-400">$39</span>
                  </div>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all">
                  Get Pro Now
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                30-day money-back guarantee • Cancel anytime
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Avg. 3.4x more leads</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Trusted by 500+</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-amber-600" />,
    bgColor: 'bg-amber-100',
    title: '50 AI Pitches / month',
    description: 'Generate 50 personalized pitches instead of just 3.'
  },
  {
    icon: <Bell className="w-5 h-5 text-blue-600" />,
    bgColor: 'bg-blue-100',
    title: '10‑sec Instant Alerts',
    description: 'Get notified the moment a high‑value job matches your skills.'
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    bgColor: 'bg-purple-100',
    title: 'Premium AI Model',
    description: 'Use GPT‑4 for pitches that convert 3x better.'
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
    bgColor: 'bg-green-100',
    title: 'Revenue Analytics',
    description: 'Track earnings, conversion rates, and ROI in real time.'
  }
];
