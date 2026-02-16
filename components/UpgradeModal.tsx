'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>
        <p className="text-slate-600 mb-6">
          Get access to 50 AI pitches per month, 10-second real-time alerts, and more.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
