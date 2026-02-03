"use client";
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Freelancer');
  const [credits, setCredits] = useState(5);
  const [showPricing, setShowPricing] = useState(false);
  const categories = ['Freelancer', 'Influencer', 'Job', 'Internship'];
  
  // Temporary job data
  const jobListings = [
    {
      id: 1,
      title: "Video Editor for Finance Channel",
      source: "Twitter",
      time: "8s ago",
      budget: "₹25,000 - ₹40,000",
      type: "Freelancer"
    },
    {
      id: 2,
      title: "React Developer Needed (Remote)",
      source: "Reddit",
      time: "15s ago",
      budget: "₹1.2L / mo",
      type: "Job"
    },
    {
      id: 3,
      title: "Social Media Influencer Campaign",
      source: "LinkedIn",
      time: "22s ago",
      budget: "₹50,000",
      type: "Influencer"
    },
    {
      id: 4,
      title: "Marketing Intern - Summer 2024",
      source: "Discord",
      time: "31s ago",
      budget: "₹20,000 / mo",
      type: "Internship"
    }
  ];

  const pricingPlans = [
    { id: 1, name: "Starter", credits: 15, price: 49, popular: false },
    { id: 2, name: "Pro", credits: 40, price: 99, popular: true },
    { id: 3, name: "Agency", credits: 100, price: 199, popular: false }
  ];

  const handleSnipe = (jobId: number) => {
    if (credits > 0) {
      setCredits(credits - 1);
      alert(`Snipe successful for job #${jobId}! Credits remaining: ${credits - 1}`);
    } else {
      setShowPricing(true);
    }
  };

  const handlePurchase = (planCredits: number) => {
    setCredits(prev => prev + planCredits);
    setShowPricing(false);
    alert(`🎉 Purchase successful! ${planCredits} credits added. Total: ${credits + planCredits}`);
  };

  // Filter jobs based on active tab
  const filteredJobs = activeTab === 'All' 
    ? jobListings 
    : jobListings.filter(job => job.type === activeTab);

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
          
          <div className="flex items-center gap-4">
            {/* Credit Balance Display */}
            <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Credits: </span>
              <span className="font-bold text-green-400">{credits}</span>
            </div>
            
            <button 
              onClick={() => setShowPricing(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
            >
              Buy Credits
            </button>
            
            <button className="text-zinc-400 hover:text-white text-sm">
              Pro Features
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Snipe your next deal in <span className="text-green-400">10 seconds</span>
          </h1>
          <p className="text-zinc-500 text-lg">
            Real-time opportunities, delivered before anyone else sees them.
          </p>
          
          {/* Credit Info Banner */}
          <div className="mt-8 p-4 bg-zinc-900 rounded-xl max-w-md mx-auto border border-zinc-800">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-zinc-400">
                <span className="text-green-400 font-bold">{credits} credits</span> available
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              {credits > 0 ? 
                "Apply to opportunities using 1 credit each" : 
                "Out of credits! Buy more to continue sniping"}
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex gap-2 mb-8 overflow-x-auto py-3">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'All' 
              ? 'bg-green-500 text-black' 
              : 'text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            All
          </button>
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
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:border-zinc-700 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {job.source}
                    </span>
                    <span>•</span>
                    <span className="text-green-400">{job.time}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{job.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSnipe(job.id)}
                  disabled={credits === 0}
                  className={`font-bold px-5 py-2 rounded-lg transition ${
                    credits > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black hover:opacity-90'
                      : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  {credits > 0 ? 'Snipe Now' : 'Need Credits'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">{job.budget}</div>
                <div className="text-sm text-zinc-500">
                  Requires <span className="text-green-400">1 credit</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Features Banner */}
        <div className="border border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-bold">Go Pro: Never Miss a Deal</h3>
              </div>
              <p className="text-zinc-400">
                Get AI-powered scripts, instant notifications, and priority access
              </p>
              <ul className="mt-3 text-sm text-zinc-500 space-y-1">
                <li>• Custom AI reply scripts for each opportunity</li>
                <li>• Push notifications on mobile/desktop</li>
                <li>• Priority access to high-value deals</li>
              </ul>
            </div>
            <button className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-zinc-200 transition whitespace-nowrap">
              Upgrade to Pro - ₹299/mo
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-zinc-600 text-sm mt-12">
          <p>Optima - The 10-Second Sniper Platform</p>
          <p className="mt-1">Free tier: 5 credits • Pro: ₹299/month • Enterprise: Custom</p>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Buy Credits</h3>
              <button 
                onClick={() => setShowPricing(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-zinc-400 mb-6">
              Choose a plan to keep sniping deals. More credits, more opportunities.
            </p>

            <div className="space-y-4">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border-2 ${
                    plan.popular
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{plan.name}</h4>
                      <p className="text-zinc-400 text-sm">
                        {plan.credits} credits
                      </p>
                      {plan.popular && (
                        <span className="text-xs bg-green-500 text-black px-2 py-1 rounded mt-1 inline-block">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{plan.price}</div>
                      <button
                        onClick={() => handlePurchase(plan.credits)}
                        className={`mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          plan.popular
                            ? 'bg-green-500 text-black hover:bg-green-600'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-zinc-500 text-sm mt-6">
              Credits never expire. Use them anytime.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
