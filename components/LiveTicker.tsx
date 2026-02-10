"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  Target,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Users,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TickerItem {
  id: number;
  type: 'lead' | 'success' | 'alert' | 'trend';
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial ticker items
  useEffect(() => {
    const generateInitialItems = () => {
      const now = new Date();
      const sampleItems: TickerItem[] = [
        {
          id: 1,
          type: 'lead',
          icon: <Target className="w-4 h-4" />,
          title: 'New React Lead',
          description: 'Senior React Developer at Google - Remote',
          timestamp: 'Just now',
          color: 'bg-blue-500'
        },
        {
          id: 2,
          type: 'success',
          icon: <Award className="w-4 h-4" />,
          title: 'Application Success',
          description: 'John accepted offer at Meta ($180k package)',
          timestamp: '2 min ago',
          color: 'bg-green-500'
        },
        {
          id: 3,
          type: 'trend',
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'Trend Alert',
          description: 'AI/ML Engineer demand up 32% this week',
          timestamp: '5 min ago',
          color: 'bg-purple-500'
        },
        {
          id: 4,
          type: 'alert',
          icon: <Zap className="w-4 h-4" />,
          title: 'High Salary Alert',
          description: 'DevOps roles averaging $145k in San Francisco',
          timestamp: '10 min ago',
          color: 'bg-amber-500'
        },
        {
          id: 5,
          type: 'lead',
          icon: <Briefcase className="w-4 h-4" />,
          title: 'Product Manager Role',
          description: 'Lead PM at Stripe - Hybrid (NYC)',
          timestamp: '15 min ago',
          color: 'bg-indigo-500'
        },
        {
          id: 6,
          type: 'success',
          icon: <CheckCircle className="w-4 h-4" />,
          title: 'Interview Scheduled',
          description: 'Sarah has interview with Amazon tomorrow',
          timestamp: '20 min ago',
          color: 'bg-emerald-500'
        }
      ];
      
      setItems(sampleItems);
    };

    generateInitialItems();
    
    // Simulate live updates
    const interval = setInterval(() => {
      if (!isPaused && items.length < 20) {
        const types = ['lead', 'success', 'alert', 'trend'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        const icons = {
          lead: <Target className="w-4 h-4" />,
          success: <Award className="w-4 h-4" />,
          alert: <AlertCircle className="w-4 h-4" />,
          trend: <TrendingUp className="w-4 h-4" />
        };
        
        const colors = {
          lead: 'bg-blue-500',
          success: 'bg-green-500',
          alert: 'bg-amber-500',
          trend: 'bg-purple-500'
        };
        
        const titles = {
          lead: ['New AI Lead', 'Remote Opportunity', 'Senior Position'],
          success: ['Offer Accepted', 'Interview Success', 'Contract Signed'],
          alert: ['Salary Alert', 'Trending Skill', 'Market Update'],
          trend: ['Demand Spike', 'New Technology', 'Industry Shift']
        };
        
        const descriptions = [
          'Full Stack Developer at Netflix - $160k package',
          'Data Scientist role with 50% remote work option',
          'Frontend Engineer positions up 45% this month',
          'Backend Developer average salary reaches $135k',
          'DevOps Engineer demand increases by 28%',
          'Product Manager roles with equity packages'
        ];
        
        const newItem: TickerItem = {
          id: Date.now(),
          type,
          icon: icons[type],
          title: titles[type][Math.floor(Math.random() * titles[type].length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          timestamp: 'Just now',
          color: colors[type]
        };
        
        setItems(prev => [newItem, ...prev.slice(0, 14)]);
      }
    }, 30000); // Add new item every 30 seconds

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  // Auto-scroll ticker
  useEffect(() => {
    if (isPaused || !tickerRef.current || !containerRef.current) return;

    const ticker = tickerRef.current;
    const container = containerRef.current;
    
    const animate = () => {
      if (ticker.scrollHeight <= container.clientHeight) return;
      
      ticker.style.transition = 'transform 20s linear';
      ticker.style.transform = `translateY(-${ticker.scrollHeight - container.clientHeight}px)`;
      
      setTimeout(() => {
        ticker.style.transition = 'none';
        ticker.style.transform = 'translateY(0)';
        
        // Move first item to end
        setTimeout(() => {
          setItems(prev => [...prev.slice(1), prev[0]]);
        }, 50);
      }, 20000);
    };

    const animationInterval = setInterval(animate, 21000);
    animate(); // Initial animation

    return () => clearInterval(animationInterval);
  }, [isPaused]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lead': return 'Lead';
      case 'success': return 'Success';
      case 'alert': return 'Alert';
      case 'trend': return 'Trend';
      default: return 'Update';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lead': return <Target className="w-3 h-3" />;
      case 'success': return <CheckCircle className="w-3 h-3" />;
      case 'alert': return <AlertCircle className="w-3 h-3" />;
      case 'trend': return <TrendingUp className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-950 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left Section - Live Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0" />
              </div>
              <span className="text-sm font-semibold text-white">LIVE</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Real-time updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">24 active users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Updated every 10s</span>
              </div>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isPaused ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-300">Resume</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-gray-300">Pause</span>
                </>
              )}
            </button>
            
            <div className="text-xs text-gray-500">
              {items.length} updates
            </div>
          </div>
        </div>

        {/* Ticker Container */}
        <div 
          ref={containerRef}
          className="relative h-10 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={tickerRef}
            className="absolute left-0 right-0"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute inset-0 flex items-center space-x-4"
                >
                  {/* Type Badge */}
                  <div className={`${item.color} text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center space-x-1`}>
                    {getTypeIcon(item.type)}
                    <span>{getTypeLabel(item.type)}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-1 bg-gray-800 rounded">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-white">{item.title}</span>
                        <span className="text-xs text-gray-400">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="hidden lg:flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">Remote</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-green-400">$145k</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-amber-400">4.8/5</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-gray-800 pt-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">24</div>
              <div className="text-xs text-gray-500">New Leads Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">68%</div>
              <div className="text-xs text-gray-500">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">12</div>
              <div className="text-xs text-gray-500">Interviews Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">3</div>
              <div className="text-xs text-gray-500">Offers Made</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">2.4d</div>
              <div className="text-xs text-gray-500">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">145</div>
              <div className="text-xs text-gray-500">Active Opportunities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
