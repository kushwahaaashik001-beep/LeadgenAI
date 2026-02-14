"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Zap, TrendingUp, Crown, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import JobCard from '@/components/JobCard';       // ✅ Simplified JobCard (only pitch & credits)
import SkillSwitcher from '@/components/SkillSwitcher';
import { Lead } from '@/app/hooks/useLeads';
import { supabase, updateUserCredits, logUserActivity } from '@/lib/supabase';

// For demo, we'll assume a hardcoded user ID (replace with actual auth)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export default function DashboardPage() {
  // ---------- STATE ----------
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [credits, setCredits] = useState(3);           // Will be overwritten by DB
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------- FETCH LEADS + CREDITS ----------
  useEffect(() => {
    const fetchUserAndLeads = async () => {
      setLoading(true);

      // 1. Get user credits (from profiles)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', DEMO_USER_ID)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error('Failed to load user data');
      } else {
        setCredits(profile.credits);
      }

      // 2. Fetch leads based on selected skill
      let query = supabase.from('leads').select('*').order('posted_date', { ascending: false });
      if (selectedSkill !== 'all') {
        query = query.eq('skill', selectedSkill);
      }
      const { data: leadsData, error: leadsError } = await query;

      if (leadsError) {
        console.error('Leads error:', leadsError);
        toast.error('Failed to load leads');
      } else {
        setLeads(leadsData as Lead[]);
      }

      setLoading(false);
    };

    fetchUserAndLeads();
  }, [selectedSkill]);

  // ---------- REAL-TIME SUBSCRIPTION ----------
  useEffect(() => {
    // Listen for new leads matching current skill filter
    const channel = supabase
      .channel('dashboard-leads')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: selectedSkill !== 'all' ? `skill=eq.${selectedSkill}` : undefined,
        },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => [newLead, ...prev]);
          toast.success('New lead arrived!', { icon: '🔥' });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSkill]);

  // ---------- HANDLERS ----------
  const handleGeneratePitch = async (lead: Lead) => {
    if (credits <= 0) {
      setIsProModalOpen(true);
      return;
    }

    try {
      // 1. Deduct one credit in database
      const newCredits = await updateUserCredits(
        DEMO_USER_ID,
        -1,
        'PRO_USAGE',
        `AI Pitch for lead: ${lead.title}`
      );
      setCredits(newCredits);

      // 2. Log activity
      await logUserActivity(DEMO_USER_ID, 'generate_pitch', { lead_id: lead.id });

      // 3. Call your actual pitch generation API (simulated)
      // await fetch('/api/generate-pitch', { method: 'POST', body: JSON.stringify({ leadId: lead.id }) });
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API

      toast.success(`✨ AI Pitch generated! (1 credit used, ${newCredits} left)`);
    } catch (error) {
      console.error('Pitch generation failed:', error);
      toast.error('Failed to generate pitch');
    }
  };

  // ---------- STATS (could be computed from DB, here simplified) ----------
  const totalLeads = leads.length;
  const creditsUsed = 3 - credits;
  const estimatedRevenue = creditsUsed * 5; // Dummy value, replace with real calculation

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onOpenPro={() => setIsProModalOpen(true)} creditsLeft={credits} />
      <UpgradeModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Credits Remaining</p>
              <p className="text-2xl font-bold text-slate-900">{credits} / 3</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Leads Available</p>
              <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Est. Revenue</p>
              <p className="text-2xl font-bold text-slate-900">${estimatedRevenue}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar – Skill Filter */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> Filter by Skill
                </h3>
                <SkillSwitcher selectedSkill={selectedSkill} onSkillChange={setSelectedSkill} />
                <p className="text-xs text-slate-500 mt-4">
                  Showing {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Pro Tip
                </h4>
                <p className="text-sm text-slate-600">
                  Use AI Pitch to stand out. Pro users get{' '}
                  <span className="font-bold text-blue-600">50 pitches/month</span> and{' '}
                  <span className="font-bold">10‑sec alerts</span>.
                </p>
              </div>
            </div>
          </aside>

          {/* Job Cards Feed */}
          <section className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedSkill === 'all' ? 'All Recommended Leads' : `${selectedSkill} Leads`}
              </h2>
              <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                {leads.length} fresh gigs
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500">No leads found for this skill. Try another filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {leads.map((lead) => (
                  <JobCard
                    key={lead.id}
                    lead={lead}
                    onGeneratePitch={handleGeneratePitch}
                    creditsRemaining={credits}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
