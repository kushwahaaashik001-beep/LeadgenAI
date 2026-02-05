"use client";
import { useState, useEffect } from 'react';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Simple components
const Card = ({ children, className = "", ...props }: any) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", variant = "default", size = "md", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95";
  
  const sizes: any = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  const variants: any = {
    default: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-2xl hover:shadow-blue-500/40",
    snipe: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:to-red-600 hover:shadow-2xl hover:shadow-orange-500/50",
    pro: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white hover:from-purple-700 hover:to-rose-700 hover:shadow-2xl hover:shadow-purple-500/40",
    outline: "border-2 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", variant = "default" }: any) => {
  const variants: any = {
    default: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30",
    secondary: "bg-white/5 text-gray-300 border border-white/10",
    outline: "border border-blue-500/30 text-blue-400 bg-transparent",
    hot: "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0",
    new: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0",
    pro: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function Home() {
  const [activeSkill, setActiveSkill] = useState('All');
  const [credits, setCredits] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [timeSinceRefresh, setTimeSinceRefresh] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // All 10 skills with emojis
  const allSkills = [
    { id: 'all', name: 'All', icon: '🔥' },
    { id: 'video', name: 'Video Editing', icon: '🎬' },
    { id: 'graphic', name: 'Graphic Design', icon: '🎨' },
    { id: 'web', name: 'Web Development', icon: '💻' },
    { id: 'uiux', name: 'UI/UX', icon: '✨' },
    { id: 'writing', name: 'Content Writing', icon: '✍️' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'motion', name: 'Motion Graphics', icon: '🎥' },
    { id: 'ai', name: 'AI Automation', icon: '🤖' },
    { id: 'app', name: 'App Development', icon: '📱' }
  ];

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        // This is where you would connect to Supabase
        // const { data, error } = await supabase
        //   .from('leads')
        //   .select('*')
        //   .eq('sub_category', activeSkill === 'All' ? null : activeSkill)
        //   .order('created_at', { ascending: false })
        //   .limit(10);
        
        // For now, using mock data
        setTimeout(() => {
          setLeads([
            {
              id: 1,
              title: "Senior Video Editor for Finance YouTube Channel",
              description: "Need experienced editor for weekly finance videos. Must understand stock market content.",
              platform: "Twitter",
              skill: "Video Editing",
              budget: "₹25,000 - ₹35,000",
              posted: "8s ago",
              url: "#",
              matchScore: 95,
              priority: "high",
              isVerified: true,
              budgetLevel: "high"
            },
            {
              id: 2,
              title: "React + Next.js Developer for SaaS Dashboard",
              description: "Building analytics dashboard with real-time data visualization. Need senior developer.",
              platform: "Reddit",
              skill: "Web Development",
              budget: "₹1.2L / month",
              posted: "15s ago",
              url: "#",
              matchScore: 88,
              priority: "high",
              isVerified: true,
              budgetLevel: "high"
            },
            {
              id: 3,
              title: "UI/UX Designer - Fintech Mobile App",
              description: "Redesigning mobile banking app. Need modern, clean design with excellent UX.",
              platform: "LinkedIn",
              skill: "UI/UX",
              budget: "₹30,000 - ₹45,000",
              posted: "22s ago",
              url: "#",
              matchScore: 92,
              priority: "medium",
              isVerified: false,
              budgetLevel: "medium"
            },
            {
              id: 4,
              title: "Technical Content Writer - AI/ML Space",
              description: "Write in-depth technical articles about machine learning and AI advancements.",
              platform: "Discord",
              skill: "Content Writing",
              budget: "₹0.50/word",
              posted: "31s ago",
              url: "#",
              matchScore: 85,
              priority: "medium",
              isVerified: true,
              budgetLevel: "medium"
            },
            {
              id: 5,
              title: "Social Media Manager - Beauty Brand",
              description: "Manage Instagram/TikTok for emerging beauty brand. Create engaging content daily.",
              platform: "Twitter",
              skill: "Social Media",
              budget: "₹20,000 - ₹25,000",
              posted: "45s ago",
              url: "#",
              matchScore: 90,
              priority: "high",
              isVerified: false,
              budgetLevel: "medium"
            }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLoading(false);
      }
    };

    fetchLeads();
  }, [activeSkill]);

  // Credit plans
  const creditPlans = [
    { 
      id: 'basic', 
      name: 'Starter Pack',
      credits: 15, 
      price: 49,
      description: "Get started with 15 credits",
      popular: false 
    },
    { 
      id: 'pro', 
      name: 'Pro Credits',
      credits: 40, 
      price: 99,
      description: "Best value for money",
      popular: true 
    }
  ];

  const proPlan = {
    price: 299,
    features: [
      { 
        icon: '⚡', 
        title: '10-Second Lead Alerts', 
        desc: 'Get notified before the competition' 
      },
      { 
        icon: '🤖', 
        title: 'AI Pitch Builder', 
        desc: 'One-click custom messages for every lead' 
      },
      { 
        icon: '♾️', 
        title: 'Unlimited Credits', 
        desc: 'No limits on applying' 
      },
      { 
        icon: '👑', 
        title: 'Premium Support', 
        desc: '24/7 help for Pro members' 
      },
      { 
        icon: '🎯', 
        title: 'Advanced Filters', 
        desc: 'Filter by High Budget & Verified Clients' 
      }
    ]
  };

  // Filter leads based on selected skill
  const filteredLeads = activeSkill === 'All' 
    ? leads 
    : leads.filter(lead => lead.skill === allSkills.find(s => s.id === activeSkill)?.name);

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
      
      // Show success animation
      const button = document.getElementById(`snipe-btn-${lead.id}`);
      if (button) {
        button.innerHTML = '🎯 APPLIED!';
        button.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');
        setTimeout(() => {
          button.innerHTML = credits > 0 || isPro ? 
            '<span class="mr-2">✨</span> APPLIED!' : 
            '💸 NEED CREDITS';
        }, 2000);
      }
      
      window.open(lead.url, '_blank');
      alert(`🎯 Successfully Applied!\n\nClient: ${lead.title}\n\nGood luck!`);
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
    alert(`🚀 Welcome to Optima Pro! Enjoy unlimited credits and premium features.`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20';
      case 'medium': return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20';
      default: return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'reddit': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'linkedin': return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'discord': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                OPTIMA
              </h1>
              <p className="text-sm text-gray-300">10-Second Freelance Lead Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl px-5 py-3 border border-white/20 shadow-lg">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-black font-bold">⚡</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="text-xs text-gray-300">AVAILABLE CREDITS</div>
                <div className="font-bold text-2xl bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  {credits}
                </div>
              </div>
            </div>

            {/* Pro Badge or Upgrade Button */}
            {isPro ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl px-5 py-3 border border-purple-500/50 shadow-lg shadow-purple-500/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-black">👑</span>
                </div>
                <div>
                  <div className="font-bold text-white">PRO MEMBER</div>
                  <div className="text-xs text-purple-300">Premium Access</div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowPricing(true)}
                variant="pro"
                size="lg"
                className="shadow-2xl shadow-purple-500/30"
              >
                <span className="mr-2">🚀</span>
                GO PRO
              </Button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">LIVE OPPORTUNITIES STREAMING IN</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              Find Clients
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              In 10 Seconds
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Our AI scans <span className="text-blue-400 font-bold">Twitter</span>, <span className="text-orange-400 font-bold">Reddit</span>, and <span className="text-cyan-400 font-bold">LinkedIn</span> 24/7 to find freelance opportunities before anyone else. 
            Don't wait for emails - <span className="text-yellow-400 font-bold">strike while the client is still online!</span>
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-2xl border border-blue-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10s</div>
              <div className="text-sm text-gray-400">Lead Delivery Time</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-400">Live Monitoring</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 rounded-2xl border border-yellow-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">90%</div>
              <div className="text-sm text-gray-400">Higher Success Rate</div>
            </div>
          </div>
        </div>

        {/* Skills Tabs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              What's Your Skill?
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {allSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setActiveSkill(skill.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeSkill === skill.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl shadow-blue-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="text-xl">{skill.icon}</span>
                <span className="text-sm">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Leads Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                🔥 LIVE OPPORTUNITIES
                <span className="text-sm text-gray-400 ml-3">
                  Auto-refresh in {10 - timeSinceRefresh}s
                </span>
              </h2>
              <p className="text-gray-400 mt-1">
                {filteredLeads.length} opportunities matching "{allSkills.find(s => s.id === activeSkill)?.name}"
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-400">LIVE</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
              ))}
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className={`rounded-2xl backdrop-blur-sm border-2 ${getPriorityColor(lead.priority)} transform transition-all duration-300 hover:scale-[1.02] hover:border-white/30`}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <Badge className={getPlatformColor(lead.platform)}>
                            {lead.platform}
                          </Badge>
                          {lead.isVerified && (
                            <Badge variant="pro" className="flex items-center gap-1">
                              <span>✅</span> Verified
                            </Badge>
                          )}
                          {lead.budgetLevel === 'high' && (
                            <Badge variant="hot" className="flex items-center gap-1">
                              <span>💰</span> High Budget
                            </Badge>
                          )}
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {lead.posted}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{lead.title}</h3>
                        <p className="text-gray-300 mb-6">{lead.description}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-400">BUDGET</div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                            {lead.budget}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-400">SKILL MATCH:</div>
                          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
                              style={{ width: `${lead.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-blue-400">{lead.matchScore}%</span>
                        </div>
                      </div>

                      {/* Snipe Button */}
                      <Button
                        id={`snipe-btn-${lead.id}`}
                        onClick={() => handleSnipe(lead)}
                        disabled={credits === 0 && !isPro}
                        variant="snipe"
                        size="lg"
                        className="min-w-[180px] shadow-2xl shadow-orange-500/40"
                      >
                        {credits > 0 || isPro ? (
                          <>
                            <span className="text-xl mr-2">🎯</span>
                            <div className="text-left">
                              <div className="font-bold">SNIPE NOW</div>
                              <div className="text-xs opacity-90">
                                {!isPro ? "(1 Credit)" : "PRO UNLIMITED"}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-xl mr-2">💸</span>
                            <div className="font-bold">NEED CREDITS</div>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">No Opportunities Found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We're scanning thousands of posts for "{allSkills.find(s => s.id === activeSkill)?.name}" opportunities. 
                New leads arrive every 10 seconds!
              </p>
            </div>
          )}
        </div>

        {/* ========== REVENUE SECTION - CIRCLE DESIGN ========== */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                💰 How OPTIMA Makes You Money
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We create <span className="text-yellow-400 font-bold">proven revenue streams</span> for freelancers. 
              Here's exactly what you get:
            </p>
          </div>

          {/* Circle Revenue Display */}
          <div className="relative mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Free Tier Circle */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-900/50 to-black/50 border-4 border-blue-500/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-400">5</div>
                      <div className="text-sm text-gray-400 mt-2">FREE CREDITS</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <span className="text-sm">🎁</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Free Trial</h3>
                <p className="text-gray-400 text-center mb-4">
                  1 credit = 1 application. Try the platform risk-free.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span className="text-sm">10-second lead delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span className="text-sm">All skill categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span className="text-sm">Basic filtering</span>
                  </div>
                </div>
              </div>

              {/* Credit Packs Circle */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-4 border-blue-500/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400">₹49-₹199</div>
                      <div className="text-sm text-gray-400 mt-2">CREDIT PACKS</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-sm">💰</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Credit Packs</h3>
                <p className="text-gray-400 text-center mb-4">
                  Buy credits in bulk. More credits = more opportunities.
                </p>
                
                <div className="w-full space-y-4">
                  {creditPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-xl border ${
                        plan.popular
                          ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold">{plan.name}</div>
                          <div className="text-sm text-gray-400">{plan.credits} credits</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-yellow-400">₹{plan.price}</div>
                          <Button
                            onClick={() => handleBuyCredits(plan)}
                            className="mt-2 text-xs px-3 py-1"
                            size="sm"
                          >
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Plan Circle */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-rose-900/30 border-4 border-purple-500/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400">₹299</div>
                      <div className="text-sm text-gray-400 mt-2">PER MONTH</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm">⚡</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">OPTIMA PRO</h3>
                <p className="text-gray-300 text-center mb-4">
                  For serious freelancers who want to 10x their income
                </p>

                <div className="w-full space-y-3 mb-6">
                  {proPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                      <span className="text-xl mt-1">{feature.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-sm">{feature.title}</div>
                        <div className="text-xs text-gray-400">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleUpgradeToPro}
                  variant="pro"
                  size="lg"
                  className="w-full shadow-2xl shadow-purple-500/40"
                >
                  <span className="mr-2">🚀</span>
                  UPGRADE TO PRO
                </Button>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="mt-12 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-3xl p-8 border border-yellow-500/30 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  📈 The ROI That Speaks For Itself
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-400">₹99</div>
                  <div className="text-sm text-gray-400">For 40 credits</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-400">1 Credit</div>
                  <div className="text-sm text-gray-400">= 1 Premium Lead</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl">
                  <div className="text-3xl font-bold text-yellow-400">90%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-2xl">
                  <div className="text-3xl font-bold text-red-400">200x</div>
                  <div className="text-sm text-gray-400">Average ROI</div>
                </div>
              </div>
              <div className="text-center text-lg">
                <span className="text-gray-300">Invest </span>
                <span className="text-yellow-400 font-bold">₹99 → </span>
                <span className="text-gray-300">Land </span>
                <span className="text-green-400 font-bold">1 Project @ ₹20,000 → </span>
                <span className="text-gray-300">That's a </span>
                <span className="text-red-400 font-bold">200x RETURN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Optima - The 10-Second Sniper Platform • Making freelance opportunities accessible in real-time
          </p>
          <p className="text-sm text-gray-500">
            Free: 5 credits • Pro: ₹299/month • Credits: ₹49-₹199 • Enterprise: Custom pricing
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <span className="text-gray-500">Twitter</span>
            <span className="text-gray-500">Reddit</span>
            <span className="text-gray-500">LinkedIn</span>
            <span className="text-gray-500">Discord</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
