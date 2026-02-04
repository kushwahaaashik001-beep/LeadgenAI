"use client";
import { useState, useEffect } from 'react';

// Simple components (no external dependencies)
const Card = ({ children, className = "", ...props }: any) => (
  <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", variant = "default", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all duration-300";
  
  const variants: any = {
    default: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/30",
    outline: "border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", variant = "default" }: any) => {
  const variants: any = {
    default: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30",
    secondary: "bg-white/5 text-gray-300 border border-white/10",
    outline: "border border-emerald-500/30 text-emerald-400 bg-transparent"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Progress = ({ value = 0, className = "" }: any) => (
  <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
    <div 
      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Custom icons (since lucide-react is missing)
const Icons = {
  Zap: () => <span>⚡</span>,
  Crown: () => <span>👑</span>,
  Target: () => <span>🎯</span>,
  Clock: () => <span>⏱️</span>,
  Sparkles: () => <span>✨</span>,
  Shield: () => <span>🛡️</span>,
  Rocket: () => <span>🚀</span>,
  CreditCard: () => <span>💳</span>,
  CheckCircle: () => <span>✅</span>,
  TrendingUp: () => <span>📈</span>,
  BellRing: () => <span>🔔</span>,
  Brain: () => <span>🧠</span>,
  ExternalLink: () => <span>↗️</span>
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [credits, setCredits] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [timeSinceRefresh, setTimeSinceRefresh] = useState(0);
  
  // User's selected skills
  const [selectedSkills, setSelectedSkills] = useState([
    'Video Editing', 'React Development', 'UI/UX Design', 'Content Writing'
  ]);
  
  // Categories with emojis
  const categories = [
    { id: 'all', label: 'All', icon: '🔥' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'dev', label: 'Development', icon: '💻' },
    { id: 'writing', label: 'Writing', icon: '✍️' },
    { id: 'marketing', label: 'Marketing', icon: '📈' }
  ];

  // Premium leads data
  const premiumLeads = [
    {
      id: 1,
      title: "Senior Video Editor for Finance YouTube Channel",
      description: "Need experienced editor for weekly finance videos. Must understand stock market content.",
      platform: "Twitter",
      category: "Video Editing",
      budget: "₹25,000 - ₹35,000",
      posted: "8s ago",
      url: "#",
      matchScore: 95,
      skills: ["Video Editing", "Finance"],
      priority: "high"
    },
    {
      id: 2,
      title: "React + Next.js Developer for SaaS Dashboard",
      description: "Building analytics dashboard with real-time data visualization. Need senior developer.",
      platform: "Reddit",
      category: "Development",
      budget: "₹1.2L / month",
      posted: "15s ago",
      url: "#",
      matchScore: 88,
      skills: ["React", "Next.js", "TypeScript"],
      priority: "high"
    },
    {
      id: 3,
      title: "UI/UX Designer - Fintech Mobile App",
      description: "Redesigning mobile banking app. Need modern, clean design with excellent UX.",
      platform: "LinkedIn",
      category: "Design",
      budget: "₹30,000 - ₹45,000",
      posted: "22s ago",
      url: "#",
      matchScore: 92,
      skills: ["UI Design", "UX Design", "Figma"],
      priority: "medium"
    },
    {
      id: 4,
      title: "Technical Content Writer - AI/ML Space",
      description: "Write in-depth technical articles about machine learning and AI advancements.",
      platform: "Discord",
      category: "Writing",
      budget: "₹0.50/word",
      posted: "31s ago",
      url: "#",
      matchScore: 85,
      skills: ["Technical Writing", "AI", "ML"],
      priority: "medium"
    },
    {
      id: 5,
      title: "Social Media Video Editor - TikTok/Reels",
      description: "Create engaging short-form video content for social media. Fast turnaround.",
      platform: "Twitter",
      category: "Video Editing",
      budget: "₹15,000 - ₹20,000",
      posted: "45s ago",
      url: "#",
      matchScore: 90,
      skills: ["Video Editing", "Social Media"],
      priority: "high"
    }
  ];

  // Pricing plans
  const creditPlans = [
    { id: 'basic', credits: 15, price: 49, popular: false },
    { id: 'pro', credits: 40, price: 99, popular: true },
    { id: 'agency', credits: 100, price: 199, popular: false }
  ];

  const proFeatures = [
    { icon: '🤖', text: "AI-Powered Reply Scripts" },
    { icon: '🔔', text: "Instant Push Notifications" },
    { icon: '🛡️', text: "Early Access to High-Budget Deals" },
    { icon: '🚀', text: "No Delay (10-Second Alerts)" },
    { icon: '📈', text: "Priority Support" },
    { icon: '✨', text: "Advanced Analytics Dashboard" }
  ];

  // Timer for refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceRefresh(prev => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSnipe = (lead: any) => {
    if (credits > 0 || isPro) {
      if (!isPro) {
        setCredits(prev => prev - 1);
      }
      alert(`🎯 Sniped: ${lead.title}\n\nWe've opened the source for you. Good luck!`);
      // In real app: window.open(lead.url, '_blank');
    } else {
      setShowPricing(true);
    }
  };

  const handleBuyCredits = (plan: any) => {
    setCredits(prev => prev + plan.credits);
    setShowPricing(false);
    alert(`✨ ${plan.credits} credits added to your account!`);
  };

  const handleUpgradeToPro = () => {
    setIsPro(true);
    setShowPricing(false);
    alert(`🚀 Welcome to Optima Pro! You now have unlimited credits and premium features.`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'medium': return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      default: return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'bg-gradient-to-r from-blue-400 to-cyan-400';
      case 'reddit': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'linkedin': return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'discord': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-xl font-bold">O</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Optima
              </h1>
              <p className="text-sm text-gray-400">10-Second Opportunity Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="relative">
                <span className="text-emerald-400">⚡</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Credits</div>
                <div className="font-bold text-xl text-white">{credits}</div>
              </div>
            </div>

            {/* Pro Badge or Upgrade Button */}
            {isPro ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl px-4 py-2 border border-purple-500/30">
                <span className="text-yellow-400">👑</span>
                <span className="font-bold">Pro Member</span>
              </div>
            ) : (
              <Button 
                onClick={() => setShowPricing(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl"
              >
                <span className="mr-2">✨</span>
                Upgrade to Pro
              </Button>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills Section */}
            <Card>
              <CardContent>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">🧠</span>
                  Your Skills
                </h3>
                <div className="space-y-2">
                  {selectedSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                      <span className="text-sm">{skill}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {Math.floor(Math.random() * 30) + 70}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-white/10 hover:bg-white/10"
                  onClick={() => setShowOnboarding(true)}
                >
                  Edit Skills
                </Button>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <Card>
              <CardContent>
                <h3 className="font-bold text-lg mb-4">Today's Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Leads Processed</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your Matches</span>
                      <span className="font-bold">42</span>
                    </div>
                    <Progress value={42} className="bg-emerald-500/30" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Avg. Response Time</span>
                      <span className="font-bold">8.2s</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/20">
              <CardContent>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">🚀</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30">
                    <span className="mr-2">🔔</span>
                    Notifications
                  </Button>
                  <Button className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30">
                    <span className="mr-2">💳</span>
                    Billing
                  </Button>
                  <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30">
                    <span className="mr-2">📈</span>
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Feed Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Live Opportunity Feed</h2>
                  <p className="text-gray-400">
                    Real-time leads matching your skills • Refreshing in {10 - timeSinceRefresh}s
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                  <span className="text-emerald-400">⏱️</span>
                  <span className="text-sm">Updated just now</span>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === category.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Grid */}
            <div className="space-y-4">
              {premiumLeads.map((lead) => (
                <div key={lead.id} className={`rounded-xl border backdrop-blur-sm ${getPriorityColor(lead.priority)}`}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Badge className={getPlatformColor(lead.platform)}>
                            {lead.platform}
                          </Badge>
                          <Badge variant="outline">
                            {lead.matchScore}% Match
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <span>⏱️</span>
                            {lead.posted}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{lead.title}</h3>
                        <p className="text-gray-400 mb-4">{lead.description}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Budget</div>
                          <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {lead.budget}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Category</div>
                          <div className="font-medium">{lead.category}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {lead.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Snipe Button */}
                      <Button
                        onClick={() => handleSnipe(lead)}
                        disabled={credits === 0 && !isPro}
                        className={`font-bold px-6 py-3 rounded-xl min-w-[140px] ${
                          credits > 0 || isPro
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {credits > 0 || isPro ? (
                          <>
                            <span className="mr-2">🎯</span>
                            SNIPE NOW
                            {!isPro && <span className="ml-2 text-xs opacity-75">(1 credit)</span>}
                          </>
                        ) : (
                          '💸 NEED CREDITS'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Banner */}
            {!isPro && (
              <div className="mt-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                        <span className="text-xl">🚀</span>
                      </div>
                      <h3 className="text-2xl font-bold">Go Pro & Never Miss a Deal</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Get unlimited credits, AI-powered reply scripts, and instant notifications
                    </p>
                    <div className="grid grid-cols-2 gap-4">
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
                      <div className="text-4xl font-bold">₹499<span className="text-xl text-gray-400">/month</span></div>
                      <div className="text-sm text-gray-400">Cancel anytime</div>
                    </div>
                    <Button 
                      onClick={() => setShowPricing(true)}
                      className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-lg w-full border border-white/10 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Upgrade Your Sniper
                </h3>
                <button 
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-white text-2xl transition"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-400">
                Choose the perfect plan for your workflow
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {creditPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border-2 ${
                      plan.popular
                        ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20'
                        : 'border-white/10 hover:border-emerald-500/30'
                    } transition-all`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white">⚡</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{plan.name}</h4>
                            <p className="text-gray-400">{plan.credits} credits</p>
                          </div>
                        </div>
                        {plan.popular && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold mb-2">₹{plan.price}</div>
                        <Button
                          onClick={() => handleBuyCredits(plan)}
                          className={`${
                            plan.popular
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl text-yellow-400">👑</span>
                  <h3 className="text-xl font-bold">Optima Pro</h3>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2">₹499<span className="text-lg text-gray-400">/month</span></div>
                  <p className="text-gray-400 text-sm">Cancel anytime</p>
                </div>

                <div className="space-y-3 mb-6">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-emerald-400">{feature.icon}</span>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleUpgradeToPro}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                >
                  <span className="mr-2">🚀</span>
                  Upgrade to Pro
                </Button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                Credits never expire • All prices in INR
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
