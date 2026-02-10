"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useUser, 
  useCredits, 
  useSubscription 
} from './context/UserContext';
import useLeads from './hooks/useLeads';
import SkillSwitcher from '@/components/SkillSwitcher';
import LeadStatusTracker from '@/components/LeadStatusTracker';
import JobCard from '@/components/JobCard';
import AIPitchGenerator from '@/components/AIPitchGenerator';
import GlobalMap from '@/components/GlobalMap';
import LiveTicker from '@/components/LiveTicker';
import {
  Zap,
  Filter,
  RefreshCw,
  Search,
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Grid,
  List,
  Download,
  Share2,
  Bell,
  Target,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { selectedSkill, user } = useUser();
  const { credits, canUseCredits } = useCredits();
  const { isPro, proPrice, upgradeToPro } = useSubscription();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    minSalary: 0,
    location: '',
    experience: '',
    datePosted: '',
    remoteOnly: false,
    verifiedOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('match_score');

  // Use leads hook
  const {
    leads,
    filteredLeads,
    isLoading,
    error,
    lastFetched,
    totalLeads,
    newLeadsCount,
    hasMore,
    fetchLeads,
    fetchMoreLeads,
    markAsContacted,
    generateAIPitch,
    refetchRealTime
  } = useLeads(filters);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (!canUseCredits(1) && !isPro) {
      toast.error('Insufficient credits! Upgrade to Pro.');
      return;
    }
    await fetchLeads(true);
    toast.success('Leads refreshed!');
  };

  // Auto-refresh notification
  useEffect(() => {
    if (isPro && newLeadsCount > 0) {
      const timer = setTimeout(() => {
        toast.custom((t) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-2xl max-w-md"
          >
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-yellow-300 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg">🎯 New Leads Found!</h4>
                <p className="text-sm opacity-90">
                  {newLeadsCount} new {selectedSkill} opportunities in the last hour
                </p>
              </div>
            </div>
          </motion.div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [newLeadsCount, isPro, selectedSkill]);

  // Stats data
  const stats = {
    totalApplications: leads.filter(l => l.status !== 'new').length,
    responseRate: 68,
    interviewRate: 24,
    avgResponseTime: '2.4 days'
  };

  // Quick actions
  const quickActions = [
    { icon: <Download />, label: 'Export Leads', action: () => toast.success('Export started') },
    { icon: <Share2 />, label: 'Share Dashboard', action: () => toast.success('Link copied') },
    { icon: <Bell />, label: 'Set Alerts', action: () => toast.success('Alerts configured') },
    { icon: <BarChart3 />, label: 'View Analytics', action: () => window.open('/analytics', '_blank') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                Find Your Dream Job
                <span className="block text-3xl md:text-4xl text-gray-300 mt-2">
                  in Real-time
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                AI-powered lead generation that finds the perfect opportunities for 
                <span className="text-purple-400 font-semibold"> {selectedSkill}</span>
              </p>
            </motion.div>

            {/* Skill Switcher */}
            <div className="mb-12">
              <SkillSwitcher />
            </div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-400">Today</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{totalLeads}</h3>
                <p className="text-gray-400">Active Opportunities</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-sm text-green-400">+{newLeadsCount} new</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.responseRate}%</h3>
                <p className="text-gray-400">Response Rate</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-400">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.interviewRate}%</h3>
                <p className="text-gray-400">Interview Rate</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-sm text-gray-400">Avg</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.avgResponseTime}</h3>
                <p className="text-gray-400">Response Time</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
          >
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search leads by company, location, or keyword..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-sm"
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-900/50 border border-gray-800 rounded-xl p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:text-white'}`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-gray-900/30 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Min Salary ($)</label>
                        <input
                          type="number"
                          value={filters.minSalary}
                          onChange={(e) => setFilters({...filters, minSalary: Number(e.target.value)})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Experience Level</label>
                        <select
                          value={filters.experience}
                          onChange={(e) => setFilters({...filters, experience: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                          <option value="">Any</option>
                          <option value="entry">Entry Level (0-2 years)</option>
                          <option value="mid">Mid Level (2-5 years)</option>
                          <option value="senior">Senior (5+ years)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Date Posted</label>
                        <select
                          value={filters.datePosted}
                          onChange={(e) => setFilters({...filters, datePosted: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                          <option value="">Any time</option>
                          <option value="24h">Last 24 hours</option>
                          <option value="7d">Last 7 days</option>
                          <option value="30d">Last 30 days</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.remoteOnly}
                            onChange={(e) => setFilters({...filters, remoteOnly: e.target.checked})}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span className="text-gray-300">Remote Only</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.verifiedOnly}
                            onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span className="text-gray-300">Verified</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Leads */}
            <div className="lg:col-span-2">
              {/* Lead Status Tracker */}
              <div className="mb-8">
                <LeadStatusTracker leads={leads} />
              </div>

              {/* Leads Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Latest Opportunities
                    <span className="text-gray-400 ml-2">({filteredLeads.length})</span>
                  </h2>
                  <p className="text-gray-400">
                    Showing {filteredLeads.length} leads for <span className="text-purple-400">{selectedSkill}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {lastFetched ? `Updated ${new Date(lastFetched).toLocaleTimeString()}` : 'Never updated'}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="match_score">Best Match</option>
                    <option value="posted_date">Newest</option>
                    <option value="salary_max">Highest Salary</option>
                    <option value="location">Location</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && leads.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-xl" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-800 rounded w-3/4" />
                          <div className="h-3 bg-gray-800 rounded w-1/2" />
                          <div className="h-3 bg-gray-800 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-2xl p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Error Loading Leads</h3>
                  <p className="text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={() => fetchLeads(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredLeads.length === 0 && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-12 text-center">
                  <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Leads Found</h3>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any opportunities matching your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        minSalary: 0,
                        location: '',
                        experience: '',
                        datePosted: '',
                        remoteOnly: false,
                        verifiedOnly: false
                      });
                      fetchLeads(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90"
                  >
                    Clear Filters & Refresh
                  </button>
                </div>
              )}

              {/* Leads Grid/List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}
                >
                  {filteredLeads.map((lead) => (
                    <JobCard
                      key={lead.id}
                      lead={lead}
                      onContacted={markAsContacted}
                      onGeneratePitch={generateAIPitch}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Load More */}
              {hasMore && filteredLeads.length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={fetchMoreLeads}
                    disabled={isLoading}
                    className="px-8 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More Opportunities'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Credits/Pro Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Your Credits</h3>
                    <p className="text-sm text-gray-400">Daily refresh in 14h 32m</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">
                      {isPro ? '∞ Unlimited' : `${credits} of 3 credits`}
                    </span>
                    <span className="text-sm text-gray-400">
                      {isPro ? 'PRO' : 'FREE'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isPro ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
                      style={{ width: isPro ? '100%' : `${(credits / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {!isPro ? (
                  <button
                    onClick={upgradeToPro}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Upgrade to Pro - ₹{proPrice}
                  </button>
                ) : (
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-yellow-300">You're a Pro Member!</p>
                    <p className="text-xs text-yellow-500/70 mt-1">Real-time updates active</p>
                  </div>
                )}
              </div>

              {/* AI Pitch Generator */}
              {isPro && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                  <AIPitchGenerator />
                </div>
              )}

              {/* Global Map */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Lead Locations</h3>
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <GlobalMap leads={leads} />
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-700 group-hover:bg-purple-500/20 rounded-lg">
                          {action.icon}
                        </div>
                        <span className="text-gray-300 group-hover:text-white">
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Updates */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Live Updates</h3>
                <LiveTicker />
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Our AI assistant can help you optimize your profile and applications.
                    </p>
                    <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                      Get Personalized Advice →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-30">
        <button
          onClick={handleRefresh}
          className="group relative p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
        >
          <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {newLeadsCount}
          </div>
        </button>
      </div>

      {/* Credit Warning Banner */}
      {credits <= 1 && !isPro && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-amber-100">
                  Only {credits} credit{credits !== 1 ? 's' : ''} remaining
                </p>
                <p className="text-xs text-amber-200/70">
                  Upgrade to Pro for unlimited access
                </p>
              </div>
              <button
                onClick={upgradeToPro}
                className="ml-4 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:opacity-90"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
