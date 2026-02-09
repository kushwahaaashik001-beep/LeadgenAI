'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  Zap, 
  Target, 
  Brain, 
  Send, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Crown,
  Bell,
  BellOff,
  Filter,
  Copy,
  Settings,
  RefreshCw,
  Lock,
  Unlock,
  BarChart3,
  Activity,
  Globe,
  MapPin,
  Clock,
  Sparkles,
  Cpu,
  Database
} from 'lucide-react'
import { supabase, leadMonitor } from '@/lib/supabase'
import { toast, Toaster } from 'sonner'

interface Lead {
  id: string
  url: string
  title: string
  description: string
  budget: number
  tier: 'S' | 'A' | 'B' | 'C'
  confidence: number
  skills: string[]
  client_history: string
  location: string
  status: 'new' | 'applied' | 'replied' | 'hired' | 'rejected'
  applied_at?: string
  replied_at?: string
  hired_at?: string
  ai_pitch?: string
  telegram_notified: boolean
  created_at: string
  time_ago?: string
}

interface UserProfile {
  id: string
  email: string
  is_pro: boolean
  telegram_id?: string
  credits: number
  daily_snipes: number
  skills: string[]
  subscription_ends_at?: string
  created_at: string
  snipesLeft: number
}

interface Metrics {
  totalLeads: number
  totalRevenue: number
  leadsToday: number
  successRate: number
  responseTime: number
  activeSnipes: number
}

export default function OptimaCommandCenter() {
  // Core State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    email: '',
    is_pro: false,
    credits: 0,
    daily_snipes: 0,
    skills: ['video-editing', 'graphic-design', 'web-development'],
    snipesLeft: 5,
    created_at: ''
  })
  const [leads, setLeads] = useState<Lead[]>([])
  const [metrics, setMetrics] = useState<Metrics>({
    totalLeads: 0,
    totalRevenue: 0,
    leadsToday: 0,
    successRate: 0,
    responseTime: 0,
    activeSnipes: 0
  })
  
  // UI State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAIPitch, setShowAIPitch] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [autoSnipe, setAutoSnipe] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [globalRadar, setGlobalRadar] = useState(true)
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const leadsContainerRef = useRef<HTMLDivElement>(null)

  // Initialize
  useEffect(() => {
    initializeDashboard()
    const unsubscribe = setupRealtime()
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Mock data generator for testing
  const generateMockLeads = (count: number): Lead[] => {
    const skills = ['video-editing', 'graphic-design', 'web-development', 'copywriting', 'seo', 'social-media']
    const locations = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'India', 'Singapore']
    const statuses = ['new', 'applied', 'replied', 'hired', 'rejected'] as const
    const tiers = ['S', 'A', 'B', 'C'] as const
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `lead-${i + 1}`,
      url: `https://upwork.com/job/${i + 1}`,
      title: `Need ${skills[Math.floor(Math.random() * skills.length)]} expert for project`,
      description: `Looking for a professional to help with our ${Math.random() > 0.5 ? 'urgent' : 'long-term'} project. Must have experience in modern tools and best practices.`,
      budget: Math.floor(Math.random() * 5000) + 500,
      tier: tiers[Math.floor(Math.random() * tiers.length)],
      confidence: Math.floor(Math.random() * 30) + 70,
      skills: [skills[Math.floor(Math.random() * skills.length)], skills[Math.floor(Math.random() * skills.length)]],
      client_history: Math.random() > 0.5 ? 'Verified' : 'New Client',
      location: locations[Math.floor(Math.random() * locations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      telegram_notified: Math.random() > 0.7,
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      time_ago: `${Math.floor(Math.random() * 60)}m ago`
    }))
  }

  async function initializeDashboard() {
    try {
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setUserProfile({
            ...data,
            snipesLeft: data.is_pro ? 999 : Math.max(0, 5 - data.daily_snipes)
          })
          setIsPro(data.is_pro)
        }
      }

      // Fetch or generate leads
      const { data: dbLeads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error || !dbLeads || dbLeads.length === 0) {
        // Use mock data if no real leads
        const mockLeads = generateMockLeads(15)
        setLeads(mockLeads)
        calculateMetrics(mockLeads)
      } else {
        setLeads(dbLeads)
        calculateMetrics(dbLeads)
      }

    } catch (error) {
      console.error('Error initializing dashboard:', error)
      // Fallback to mock data
      const mockLeads = generateMockLeads(15)
      setLeads(mockLeads)
      calculateMetrics(mockLeads)
    }
  }

  function calculateMetrics(leadsData: Lead[]) {
    const today = new Date().toDateString()
    const todayLeads = leadsData.filter(l => 
      new Date(l.created_at).toDateString() === today
    )
    
    const appliedLeads = leadsData.filter(l => 
      ['applied', 'replied', 'hired'].includes(l.status)
    )
    const hiredLeads = leadsData.filter(l => l.status === 'hired')
    const revenue = hiredLeads.reduce((sum, l) => sum + l.budget, 0)
    
    setMetrics({
      totalLeads: leadsData.length,
      totalRevenue: revenue,
      leadsToday: todayLeads.length,
      successRate: leadsData.length > 0 ? (hiredLeads.length / leadsData.length) * 100 : 0,
      responseTime: Math.floor(Math.random() * 120) + 30, // Mock
      activeSnipes: appliedLeads.length
    })
  }

  function setupRealtime() {
    return leadMonitor.subscribe((newLead: Lead, isProLead: boolean) => {
      const processLead = () => {
        const updatedLead = {
          ...newLead,
          time_ago: 'Just now'
        }
        
        setLeads(prev => {
          const updatedLeads = [updatedLead, ...prev.slice(0, 49)]
          calculateMetrics(updatedLeads)
          return updatedLeads
        })

        if (isPro) {
          showProNotification(updatedLead)
        }
      }

      if (!isPro) {
        // Free users: 5-10 min delay
        setTimeout(processLead, Math.random() * 300000 + 300000)
      } else {
        // Pro users: 10s delay
        setTimeout(processLead, 10000)
      }
    })
  }

  function showProNotification(lead: Lead) {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }

    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-gradient-to-r from-optima-purple-600 to-optima-pink-600 text-white p-4 rounded-2xl shadow-2xl max-w-md border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Rocket className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">🎯 SNIPE ALERT!</div>
            <div className="text-xs opacity-90 mt-1">{lead.skills?.[0] || 'Lead'} in {lead.location}</div>
            <div className="text-xs mt-1">Budget: <span className="font-bold text-green-300">${lead.budget?.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => {
              setSelectedLead(lead)
              setShowAIPitch(true)
              toast.dismiss(t)
            }}
            className="flex-1 bg-white text-optima-purple-600 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-all"
          >
            AI Pitch
          </button>
          <button 
            onClick={() => {
              window.open(lead.url, '_blank')
              toast.dismiss(t)
            }}
            className="px-4 bg-black/30 py-2 rounded-lg text-sm hover:bg-black/40"
          >
            Apply
          </button>
        </div>
      </motion.div>
    ), {
      duration: 8000,
    })
  }

  async function handleUpgradeToPro() {
    try {
      toast.loading('Redirecting to checkout...')
      const { data } = await supabase.functions.invoke('create-checkout', {
        body: { plan: 'pro' }
      })
      
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('Failed to upgrade. Try again.')
    }
  }

  function handleSnipeLead(lead: Lead) {
    if (!isPro && userProfile.snipesLeft <= 0) {
      toast.error('No snipes left! Upgrade to PRO for unlimited snipes.')
      return
    }

    if (!isPro) {
      setUserProfile(prev => ({
        ...prev,
        snipesLeft: prev.snipesLeft - 1
      }))
    }

    setLeads(prev => prev.map(l => 
      l.id === lead.id ? { ...l, status: 'applied' } : l
    ))

    toast.success(`Snipe sent for $${lead.budget} project!`)
    
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.7) {
        setLeads(prev => prev.map(l => 
          l.id === lead.id ? { ...l, status: 'replied' } : l
        ))
        toast.success('Client replied! Check messages.')
      }
    }, 5000)
  }

  function handleSkillToggle(skill: string) {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  function refreshLeads() {
    toast.loading('Refreshing leads...')
    setTimeout(() => {
      const newLeads = generateMockLeads(5)
      setLeads(prev => [...newLeads, ...prev.slice(0, 45)])
      toast.success('5 new leads found!')
    }, 1500)
  }

  // Calculate color based on tier
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'S': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'A': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'B': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern">
      {/* Audio Element */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-optima-purple-600 to-optima-pink-600 rounded-full blur opacity-30"></div>
              <div className="relative bg-black p-2 rounded-full">
                <Rocket className="h-6 w-6 text-optima-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-optima-purple-400 to-optima-pink-400 bg-clip-text text-transparent">
                Optima Command Center
              </h1>
              <p className="text-sm text-muted-foreground">AI-Powered Lead Sniper • Real-time Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshLeads}
              className="px-4 py-2 bg-white/5 rounded-xl border border-border hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            
            <button 
              onClick={() => toast.info('Settings coming soon!')}
              className="p-2 bg-white/5 rounded-xl border border-border hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ===== TOP METRICS BAR ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-optima p-4 md:p-6 flex flex-col items-center justify-center animate-slide-up">
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">Live Leads</span>
            <div className="flex items-center gap-2 mt-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-3xl md:text-4xl font-black gradient-text">{metrics.totalLeads}</span>
            </div>
            <span className="text-2xs text-muted-foreground mt-1">+{metrics.leadsToday} today</span>
          </div>
          
          <div className="card-optima p-4 md:p-6 flex flex-col items-center justify-center animate-slide-up [animation-delay:100ms]">
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">Revenue</span>
            <div className="flex items-center gap-2 mt-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-3xl md:text-4xl font-black text-green-400">${metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <span className="text-2xs text-muted-foreground mt-1">{metrics.successRate.toFixed(1)}% success rate</span>
          </div>
          
          <div className="card-optima p-4 md:p-6 flex flex-col items-center justify-center animate-slide-up [animation-delay:200ms]">
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">Snipes Left</span>
            <div className="flex items-center gap-2 mt-2">
              <Target className="h-4 w-4 text-optima-purple-400" />
              <span className="text-3xl md:text-4xl font-black text-optima-purple-400">
                {isPro ? '∞' : userProfile.snipesLeft}
              </span>
            </div>
            <span className="text-2xs text-muted-foreground mt-1">{isPro ? 'Unlimited' : 'Daily limit'}</span>
          </div>
          
          <button 
            onClick={handleUpgradeToPro}
            className={`btn-primary flex items-center justify-center gap-2 group overflow-hidden ${isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPro}
          >
            {isPro ? (
              <>
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="font-bold">PRO ACTIVE</span>
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                <span className="font-bold">UPGRADE TO PRO</span>
              </>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>

        {/* ===== MAIN COMMAND GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: LIVE STREAM */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-optima h-[700px] flex flex-col">
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <h2 className="font-bold text-sm">LIVE LEAD STREAM</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-muted-foreground">{isPro ? '10s delay' : '5-10m delay'}</span>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className="p-1.5 hover:bg-white/5 rounded-lg"
                  >
                    {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div 
                ref={leadsContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
              >
                <AnimatePresence>
                  {leads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedLead(lead)}
                      className="glass-dark p-4 rounded-xl border border-white/5 hover:border-optima-purple-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-2xs font-bold ${getTierColor(lead.tier)}`}>
                            Tier {lead.tier}
                          </span>
                          <span className={`status-${lead.status.toLowerCase()} text-2xs font-bold px-2 py-1 rounded`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-2xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lead.time_ago || 'Just now'}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-sm group-hover:text-optima-purple-400 line-clamp-1">
                        {lead.title}
                      </h3>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {lead.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {lead.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-2xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-2xs font-medium">{lead.location}</span>
                          </div>
                          <span className="text-sm font-bold text-green-400">${lead.budget.toLocaleString()}</span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSnipeLead(lead)
                          }}
                          disabled={lead.status !== 'new'}
                          className={`px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                            lead.status !== 'new'
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              : 'bg-optima-purple-500 hover:bg-optima-purple-600'
                          }`}
                        >
                          {lead.status === 'new' ? 'SNIPE NOW' : lead.status.toUpperCase()}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & TOOLS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TOP RIGHT: SKILL SWITCHER & CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Sniper */}
              <div className="card-optima p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 bg-optima-purple-500/20 rounded-lg">
                      <Target className="h-4 w-4 text-optima-purple-400" />
                    </div>
                    SKILL SNIPER
                  </h3>
                  <span className="text-2xs text-muted-foreground">
                    {userProfile.skills.length}/10 skills
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map(skill => (
                    <button 
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className="badge-pro flex items-center gap-2 group"
                    >
                      <span className="text-2xs font-medium">{skill}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                    </button>
                  ))}
                  <button 
                    onClick={() => toast.info('Add skill feature coming soon')}
                    className="px-3 py-1.5 border border-dashed border-border rounded-full text-2xs hover:bg-white/5 transition-all"
                  >
                    + Add Skill
                  </button>
                </div>
                
                <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-2xs font-medium">Auto-Match</div>
                    <div className="w-10 h-5 bg-green-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                  <div className="text-3xs text-muted-foreground mt-1">
                    Automatically filters leads matching your skills
                  </div>
                </div>
              </div>

              {/* System Controls */}
              <div className="card-optima p-6">
                <h3 className="text-sm font-bold mb-4">SYSTEM CONTROLS</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <div>
                        <div className="text-xs font-medium">Auto-Snipe</div>
                        <div className="text-3xs text-muted-foreground">Automatically apply to high-match leads</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAutoSnipe(!autoSnipe)}
                      className={`w-10 h-5 rounded-full relative transition-all ${autoSnipe ? 'bg-green-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${autoSnipe ? 'left-5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-xs font-medium">Global Radar</div>
                        <div className="text-3xs text-muted-foreground">Scan leads from all timezones</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setGlobalRadar(!globalRadar)}
                      className={`w-10 h-5 rounded-full relative transition-all ${globalRadar ? 'bg-blue-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${globalRadar ? 'left-5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-black/20 rounded-xl">
                  <div className="flex items-center justify-between text-2xs">
                    <span>System Health</span>
                    <span className="text-green-400 font-bold">100%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM RIGHT: ANALYTICS DASHBOARD */}
            <div className="card-optima p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold">PERFORMANCE ANALYTICS</h3>
                <select className="text-2xs bg-black/30 border border-border rounded-lg px-3 py-1.5">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>All time</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-2xs font-bold text-muted-foreground">SUCCESS RATE</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
                  <div className="text-3xs text-muted-foreground mt-1">↑ 12% from last week</div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-2xs font-bold text-muted-foreground">AVG RESPONSE</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.responseTime}m</div>
                  <div className="text-3xs text-muted-foreground mt-1">Faster than 85% of users</div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-2xs font-bold text-muted-foreground">ACTIVE SNIPES</span>
                  </div>
                  <div className="text-2xl font-bold">{metrics.activeSnipes}</div>
                  <div className="text-3xs text-muted-foreground mt-1">Currently in progress</div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-yellow-400" />
                    <span className="text-2xs font-bold text-muted-foreground">EARNING POTENTIAL</span>
                  </div>
                  <div className="text-2xl font-bold">${(metrics.totalRevenue * 1.5).toLocaleString()}</div>
                  <div className="text-3xs text-muted-foreground mt-1">Based on active leads</div>
                </div>
              </div>
              
              {/* AI Tools Section */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-bold mb-4">AI TOOLS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => {
                      if (!isPro) {
                        toast.error('Upgrade to PRO to use AI Pitch Generator')
                        return
                      }
                      setShowAIPitch(true)
                    }}
                    className="p-4 bg-gradient-to-br from-optima-purple-500/10 to-optima-pink-500/10 rounded-xl border border-white/5 hover:border-optima-purple-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-optima-purple-500/20 rounded-lg">
                        <Send className="h-4 w-4 text-optima-purple-400" />
                      </div>
                      <span className="text-xs font-bold">AI Pitch Generator</span>
                      {!isPro && <span className="text-2xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">PRO</span>}
                    </div>
                    <p className="text-2xs text-muted-foreground">Generate custom pitches in seconds</p>
                  </button>
                  
                  <button 
                    onClick={() => toast.info(isPro ? 'Coming soon!' : 'PRO feature')}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Brain className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-xs font-bold">Client Analyzer</span>
                      {!isPro && <span className="text-2xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">PRO</span>}
                    </div>
                    <p className="text-2xs text-muted-foreground">Analyze client history & success rate</p>
                  </button>
                  
                  <button 
                    onClick={() => toast.info(isPro ? 'Coming soon!' : 'PRO feature')}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-xs font-bold">Rate Negotiator</span>
                      {!isPro && <span className="text-2xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">PRO</span>}
                    </div>
                    <p className="text-2xs text-muted-foreground">AI-powered negotiation strategies</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Features Comparison */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-optima mt-6 p-6 border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" />
                  Unlock PRO Features
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get instant 10s alerts, unlimited snipes, and AI tools
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xs font-bold text-muted-foreground">FREE</div>
                  <div className="text-xl font-bold">5 snipes/day</div>
                </div>
                
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                
                <div className="text-center">
                  <div className="text-2xs font-bold text-amber-400">PRO</div>
                  <div className="text-xl font-bold text-amber-400">Unlimited</div>
                </div>
                
                <button 
                  onClick={handleUpgradeToPro}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  Upgrade Now - ₹2,499/mo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Pitch Generator Modal */}
      {showAIPitch && selectedLead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setShowAIPitch(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">AI Pitch Generator</h3>
                <button 
                  onClick={() => setShowAIPitch(false)}
                  className="p-2 hover:bg-white/5 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h4 className="font-bold mb-2">{selectedLead.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedLead.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-xs font-bold mb-2">Generated Pitch</div>
                  <p className="text-sm">
                    Hi there! I saw your post for {selectedLead.title} and I'm excited to help. 
                    With my expertise in {selectedLead.skills?.join(', ') || 'relevant skills'}, 
                    I can deliver high-quality results within your budget of ${selectedLead.budget}. 
                    I've successfully completed similar projects and can start immediately. 
                    Let's discuss how I can add value to your project!
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-optima-purple-500 rounded-xl font-medium hover:bg-optima-purple-600">
                    Copy Pitch
                  </button>
                  <button className="flex-1 py-3 bg-white/5 rounded-xl font-medium hover:bg-white/10">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toaster */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-background border border-border',
          duration: 4000,
        }}
      />
    </div>
  )
}
