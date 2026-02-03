"use client";
import { useState } from 'react';
import JobCard from '@/components/JobCard';
import CreditBalance from '@/components/CreditBalance';
import PricingModal from '@/components/PricingModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Freelancer');
  const [credits, setCredits] = useState(5); // Free credits
  const [showPricing, setShowPricing] = useState(false);
  const categories = ['Freelancer', 'Influencer', 'Job', 'Internship'];

  const handleSnipe = () => {
    if (credits > 0) {
      setCredits(credits - 1);
      // Your snipe logic here
    } else {
      setShowPricing(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl">
              O
            </div>
            <h1 className="text-2xl font-bold">Optima</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <CreditBalance credits={credits} />
            <button 
              onClick={() => setShowPricing(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
            >
              Buy Credits
            </button>
            <button className="text-zinc-400 hover:text-white">
              Pro Features
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Snipe your next deal in <span className="text-green-400">10 seconds</span>
          </h2>
          <p className="text-zinc-500 text-lg">
            Real-time opportunities, delivered before anyone else sees them.
          </p>
          
          {/* Credit Info */}
          <div className="mt-8 p-4 bg-zinc-900 rounded-xl max-w-md mx-auto">
            <p className="text-sm text-zinc-400">
              <span className="text-green-400">{credits} free credits</span> remaining
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              After 5 free applications, buy credits to keep sniping
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === cat 
                ? 'bg-green-500 text-black' 
                : 'text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Leads List */}
        <div className="space-y-4 mb-12">
          <JobCard 
            title="Video Editor for Finance Channel"
            source="Twitter"
            time="8s ago"
            budget="₹25,000 - ₹40,000"
            type={activeTab}
            onSnipe={handleSnipe}
            creditsRequired={1}
          />
          <JobCard 
            title="React Developer Needed (Remote)"
            source="Reddit"
            time="15s ago"
            budget="₹1.2L / mo"
            type={activeTab}
            onSnipe={handleSnipe}
            creditsRequired={1}
          />
        </div>

        {/* Pro Features Banner */}
        <div className="border border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/10 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 Go Pro: Never Miss a Deal</h3>
              <p className="text-zinc-400">
                Get AI-powered scripts & instant notifications for ₹299/month
              </p>
            </div>
            <button className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)}
          onPurchase={(credits) => {
            setCredits(prev => prev + credits);
            setShowPricing(false);
          }}
        />
      )}
    </main>
  );
}
