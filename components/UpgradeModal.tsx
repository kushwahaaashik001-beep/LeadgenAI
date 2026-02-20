'use client';

import { X, Loader, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  loading: boolean;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, loading }: UpgradeModalProps) {
  // ESC key se modal band karne ka logic
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Modal ke andar click karne par band na ho
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Upgrade to Pro</h2>
          <p className="text-slate-500 mt-2">
            Get exclusive features and grow your business faster.
          </p>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {[
            { title: "50 AI pitches", desc: "per month" },
            { title: "10‑second", desc: "real-time alerts" },
            { title: "Unlimited", desc: "lead views" },
            { title: "Priority", desc: "customer support" }
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">
                <span className="font-semibold">{item.title}</span> {item.desc}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium disabled:opacity-50"
          >
            Maybe later
          </button>
          <button
            onClick={onUpgrade}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Upgrade – ₹199'
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-wider font-semibold">
          Secure payment via Razorpay • Cancel anytime
        </p>
      </div>
    </div>
  );
}
