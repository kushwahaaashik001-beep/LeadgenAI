"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Crown, 
  Target, 
  Clock, 
  Sparkles, 
  Shield, 
  Rocket,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  BellRing,
  Brain,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock user data - In real app, this comes from Supabase
const userSkills = ['Video Editing', 'React Development', 'UI/UX Design', 'Content Writing'];
const userCredits = 5;
const isPro = false;

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [credits, setCredits] = useState(userCredits);
  const [proStatus, setProStatus] = useState(isPro);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills);
  const [timeSinceRefresh, setTimeSinceRefresh] = useState(0);

  // Categories with icons
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
      budget: "$2,500 - $3,500",
      posted: "8s ago",
      url: "https://twitter.com/job/1",
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
      budget: "$5,000/month",
      posted: "15s ago",
      url: "https://reddit.com/job/1",
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
      budget: "$3,000 - $4,500",
      posted: "22s ago",
      url: "https://linkedin.com/job/1",
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
      budget: "$0.50/word",
      posted: "31s ago",
      url: "https://discord.com/job/1",
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
      budget: "$1,500 - $2,000",
      posted: "45s ago",
      url: "https://twitter.com/job/2",
      matchScore: 90,
      skills: ["Video Editing", "Social Media"],
      priority: "high"
    }
  ];

  // Pricing plans
  const creditPlans = [
    { id: 'basic', credits: 15, price: 49, perCredit: 3.27 },
    { id: 'pro', credits: 40, price: 99, perCredit: 2.48, popular: true },
    { id: 'agency', credits: 100, price: 199, perCredit: 1.99 }
  ];

  const proFeatures = [
    { icon: Brain, text: "AI-Powered Reply Scripts" },
    { icon: BellRing, text: "Instant Push Notifications" },
    { icon: Shield, text: "Early Access to High-Budget Deals" },
    { icon: Rocket, text: "No Delay (10-Second Alerts)" },
    { icon: TrendingUp, text: "Priority Support" },
    { icon: Sparkles, text: "Advanced Analytics Dashboard" }
  ];

  // Timer for refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceRefresh(prev => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSnipe = (lead: any) => {
    if (credits > 0 || proStatus) {
      if (!proStatus) {
        setCredits(prev => prev - 1);
      }
      window.open(lead.url, '_blank');
      
      // Show success feedback
      const event = new CustomEvent('snipeSuccess', { detail: lead });
      window.dispatchEvent(event);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleBuyCredits = (plan: any) => {
    setCredits(prev => prev + plan.credits);
    setShowUpgradeModal(false);
    // In real app: Process payment
  };

  const handleUpgradeToPro = () => {
    setProStatus(true);
    setShowUpgradeModal(false);
    // In real app: Process subscription
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
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Main Layout */}
      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
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

          <div className="flex items-center gap-6">
            {/* Credits Display */}
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="relative">
                <Zap className="w-5 h-5 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Credits</div>
                <div className="font-bold text-xl text-white">{credits}</div>
              </div>
            </div>

            {/* Pro Badge or Upgrade Button */}
            {proStatus ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl px-4 py-2 border border-purple-500/30">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">Pro Member</span>
              </div>
            ) : (
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <div className="hidden md:block">
                <div className="font-medium">Freelancer</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Skills Section */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-400" />
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Today's Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Leads Processed</span>
                        <span className="font-bold">1,247</span>
                      </div>
                      <Progress value={85} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Your Matches</span>
                        <span className="font-bold">42</span>
                      </div>
                      <Progress value={42} className="h-2 bg-emerald-500/30" />
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
              <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border-emerald-500/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30">
                      <BellRing className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing & Subscription
                    </Button>
                    <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analytics Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Feed Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Live Opportunity Feed</h2>
                  <p className="text-gray-400">
                    Real-time leads matching your skills • Refreshing in {10 - timeSinceRefresh}s
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Updated just now</span>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeFilter === category.id ? "default" : "outline"}
                    className={`rounded-full px-4 py-2 ${
                      activeFilter === category.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setActiveFilter(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Leads Grid */}
            <div className="space-y-4">
              <AnimatePresence>
                {premiumLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden backdrop-blur-sm border-white/10 ${getPriorityColor(lead.priority)}`}>
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className={getPlatformColor(lead.platform)}>
                                {lead.platform}
                              </Badge>
                              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                                {lead.matchScore}% Match
                              </Badge>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lead.posted}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{lead.title}</h3>
                            <p className="text-gray-400 mb-4">{lead.description}</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
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
                            <div className="flex gap-2">
                              {lead.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="bg-white/5">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Snipe Button */}
                          <Button
                            onClick={() => handleSnipe(lead)}
                            disabled={credits === 0 && !proStatus}
                            className={`font-bold px-6 py-3 rounded-xl ${
                              credits > 0 || proStatus
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {credits > 0 || proStatus ? (
                              <>
                                <Target className="w-4 h-4 mr-2" />
                                SNIPE NOW
                                {!proStatus && <span className="ml-2 text-xs opacity-75">(1 credit)</span>}
                              </>
                            ) : (
                              '💸 NEED CREDITS'
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {premiumLeads.length === 0 && (
              <Card className="backdrop-blur-sm border-white/10">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No New Opportunities</h3>
                  <p className="text-gray-400 mb-6">
                    We're scanning platforms for opportunities matching your skills. Check back in a few seconds!
                  </p>
                  <Button variant="outline" className="border-white/10">
                    Refresh Feed
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-4xl w-full overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Upgrade Your Sniper
                  </h2>
                  <p className="text-gray-400 mt-2">Choose the perfect plan for your workflow</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Credit Plans */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-6">Buy Credits</h3>
                  <div className="space-y-4">
                    {creditPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-6 rounded-xl border-2 ${
                          plan.popular
                            ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20'
                            : 'border-white/10 hover:border-emerald-500/30'
                        } transition-all`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-xl">{plan.credits} Credits</h4>
                                <p className="text-gray-400">${plan.perCredit.toFixed(2)} per credit</p>
                              </div>
                            </div>
                            {plan.popular && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                Most Popular
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold mb-2">₹{plan.price}</div>
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
                </div>

                {/* Pro Plan */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="w-8 h-8 text-yellow-400" />
                      <h3 className="text-xl font-bold">Optima Pro</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold mb-2">₹499<span className="text-lg text-gray-400">/month</span></div>
                      <p className="text-gray-400 text-sm">Cancel anytime</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {proFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <feature.icon className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleUpgradeToPro}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xl font-bold mb-6">Plan Comparison</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-400">Feature</div>
                  <div className="text-center font-bold">Free</div>
                  <div className="text-center font-bold text-emerald-400">Pro</div>
                  
                  <div className="border-t border-white/10 py-3">Lead Delay</div>
                  <div className="border-t border-white/10 py-3 text-center">10 seconds</div>
                  <div className="border-t border-white/10 py-3 text-center">Instant ⚡</div>
                  
                  <div className="border-t border-white/10 py-3">Credits</div>
                  <div className="border-t border-white/10 py-3 text-center">5 free</div>
                  <div className="border-t border-white/10 py-3 text-center">Unlimited ✨</div>
                  
                  <div className="border-t border-white/10 py-3">AI Scripts</div>
                  <div className="border-t border-white/10 py-3 text-center">❌</div>
                  <div className="border-t border-white/10 py-3 text-center">✅</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
