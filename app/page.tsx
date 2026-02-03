"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [credits, setCredits] = useState(5);
  const [showPricing, setShowPricing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const categories = ['All', 'Freelancer', 'Influencer', 'Job', 'Internship'];
  
  // Professional job data with better categories
  const jobListings = [
    {
      id: 1,
      title: "🎬 Senior Video Editor for Finance Channel",
      source: "Twitter",
      time: "Just now",
      budget: "₹25,000 - ₹40,000",
      type: "Freelancer",
      urgency: "high",
      color: "purple"
    },
    {
      id: 2,
      title: "⚛️ React Developer Needed (Remote Project)",
      source: "Reddit",
      time: "15s ago",
      budget: "₹1.2L / month",
      type: "Job",
      urgency: "medium",
      color: "blue"
    },
    {
      id: 3,
      title: "📱 Social Media Influencer Campaign (Beauty)",
      source: "LinkedIn",
      time: "22s ago",
      budget: "₹50,000",
      type: "Influencer",
      urgency: "high",
      color: "pink"
    },
    {
      id: 4,
      title: "🎓 Marketing Intern - Summer 2024",
      source: "Discord",
      time: "31s ago",
      budget: "₹20,000 / month",
      type: "Internship",
      urgency: "low",
      color: "green"
    },
    {
      id: 5,
      title: "🎨 UI/UX Designer for SaaS Startup",
      source: "Twitter",
      time: "45s ago",
      budget: "₹80,000 - ₹1L",
      type: "Freelancer",
      urgency: "high",
      color: "orange"
    },
    {
      id: 6,
      title: "📈 Content Writer - Finance Niche",
      source: "Reddit",
      time: "1m ago",
      budget: "₹35,000 / month",
      type: "Freelancer",
      urgency: "medium",
      color: "yellow"
    }
  ];

  const pricingPlans = [
    { 
      id: 1, 
      name: "Starter", 
      credits: 15, 
      price: 49,
      popular: false,
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      name: "Pro", 
      credits: 40, 
      price: 99,
      popular: true,
      gradient: "from-purple-600 to-pink-600"
    },
    { 
      id: 3, 
      name: "Agency", 
      credits: 100, 
      price: 199,
      popular: false,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSnipe = (jobId: number) => {
    if (credits > 0) {
      setCredits(credits - 1);
      // Show success animation
      const button = document.getElementById(`snipe-btn-${jobId}`);
      if (button) {
        button.classList.add('bg-green-500');
        setTimeout(() => {
          button.classList.remove('bg-green-500');
          button.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');
        }, 300);
      }
      alert(`🎯 Successfully sniped! Client notified. Credits remaining: ${credits - 1}`);
    } else {
      setShowPricing(true);
    }
  };

  const handlePurchase = (planCredits: number) => {
    setCredits(prev => prev + planCredits);
    setShowPricing(false);
    alert(`✨ ${planCredits} credits added to your account!`);
  };

  // Filter jobs based on active tab
  const filteredJobs = activeTab === 'All' 
    ? jobListings 
    : jobListings.filter(job => job.type === activeTab);

  // Color mapping
  const getColorClass = (color: string) => {
    const colorMap: {[key: string]: string} = {
      purple: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      blue: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      pink: 'bg-gradient-to-r from-pink-600 to-rose-600',
      green: 'bg-gradient-to-r from-green-600 to-emerald-600',
      orange: 'bg-gradient-to-r from-orange-600 to-amber-600',
      yellow: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    };
    return colorMap[color] || 'bg-gradient-to-r from-gray-600 to-gray-700';
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyMap: {[key: string]: {text: string, color: string}} = {
      high: { text: '🔥 HOT', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
      medium: { text: '⚡ FRESH', color: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
      low: { text: '📝 NEW', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' }
    };
    const data = urgencyMap[urgency] || { text: 'NEW', color: 'bg-gray-600' };
    return (
      <span className={`${data.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
        {data.text}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-500/20">
                O
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Optima
              </h1>
              <p className="text-xs text-emerald-400 font-medium">10-Second Sniper</p>
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Credit Balance */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black rounded-full px-5 py-2.5 border border-white/10 shadow-lg">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-black font-bold text-sm">✨</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Credits</span>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {credits}
                </span>
              </div>
            </div>
            
            {/* Buttons */}
            <button 
              onClick={() => setShowPricing(true)}
              className="relative group bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <span className="relative z-10">💎 Buy Credits</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="text-gray-400 hover:text-white transition flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5">
              <span>🚀</span>
              <span className="font-medium">Pro</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-300">Live Opportunities Streaming In</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
              Snipe Deals
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              In {timeLeft} Seconds
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Real-time freelance gigs, jobs & internships delivered instantly. 
            Be the first to apply and win more deals.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">10s</div>
              <div className="text-sm text-gray-400">Average Lead Time</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">90%</div>
              <div className="text-sm text-gray-400">Higher Success Rate</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-400">Live Monitoring</div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                activeTab === cat 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                : 'text-gray-400 hover:text-white bg-gray-900/50 border-white/5 hover:bg-gray-800/50 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className={`${getColorClass(job.color)}/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getUrgencyBadge(job.urgency)}
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10">
                      {job.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-white/90">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-emerald-300 font-medium">{job.time}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="px-3 py-1 rounded-full bg-black/30 text-sm border border-white/10">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {job.budget}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    1 credit • Instant apply
                  </div>
                </div>
                <button
                  id={`snipe-btn-${job.id}`}
                  onClick={() => handleSnipe(job.id)}
                  disabled={credits === 0}
                  className={`font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                    credits > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {credits > 0 ? (
                    <span className="flex items-center gap-2">
                      <span>🎯</span>
                      SNIPE NOW
                    </span>
                  ) : '💸 Need Credits'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Features Banner */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20"></div>
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                      <span className="text-xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      Optima Pro
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 text-lg">
                    Supercharge your sniping with AI-powered tools
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <span>🤖</span>
                      </div>
                      <div>
                        <div className="font-bold">AI Scripts</div>
                        <div className="text-sm text-gray-400">Smart replies</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span>🔔</span>
                      </div>
                      <div>
                        <div className="font-bold">Push Alerts</div>
                        <div className="text-sm text-gray-400">Instant notifications</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl font-bold">₹299<span className="text-xl text-gray-400">/month</span></div>
                    <div className="text-sm text-gray-400">Cancel anytime</div>
                  </div>
                  <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg shadow-white/10 hover:shadow-xl">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Fuel Your Sniper
                </h3>
                <button 
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-white text-2xl transition"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-400">
                Buy credits to keep sniping fresh opportunities. Credits never expire.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="p-8">
              <div className="space-y-4">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-xl border-2 ${
                      plan.popular
                        ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20'
                        : 'border-white/10 hover:border-emerald-500/30'
                    } group hover:scale-[1.02] transition-all duration-300`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg ${plan.gradient} flex items-center justify-center`}>
                            <span className="text-white">✨</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-xl">{plan.name}</h4>
                            <p className="text-gray-400">{plan.credits} snipe credits</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold mb-2">₹{plan.price}</div>
                        <button
                          onClick={() => handlePurchase(plan.credits)}
                          className={`px-6 py-2 rounded-lg font-bold transition ${
                            plan.popular
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-400">
                      ≈ {Math.round(plan.credits / 5)} deals per week for a month
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span>💎</span>
                  </div>
                  <div>
                    <div className="font-bold">Free Trial</div>
                    <div className="text-sm text-gray-400">5 credits free for new users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
