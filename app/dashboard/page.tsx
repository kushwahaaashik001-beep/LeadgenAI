"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import JobCard from '@/components/JobCard';
import SkillSwitcher from '@/components/SkillSwitcher'; // Ensure this component exists
import { Lead } from '@/app/hooks/useLeads'; // Adjust path as needed

// Dummy leads data – replace with real API later
const dummyLeads: Lead[] = [
  {
    id: '1',
    title: 'Video Editor for YouTube Shorts (Hormozi Style)',
    company: 'Growth Hackers',
    location: 'Remote',
    salary_min: 200,
    salary_max: 300,
    salary_currency: '$',
    posted_date: new Date().toISOString(),
    description: 'Need intense, fast-paced editing for daily shorts. Experience with CapCut & Premiere Pro required.',
    requirements: ['Video Editing', 'CapCut', 'Premiere Pro', 'Hormozi Style'],
    contact_email: 'hiring@growthhackers.io',
    application_url: 'https://example.com/apply',
    status: 'new',
    match_score: 92,
    company_logo: null,
    type: 'Freelance',
    skill: 'Video Editing',
    notes: ''
  },
  {
    id: '2',
    title: 'React / Next.js Developer',
    company: 'TechFlow',
    location: 'San Francisco (Remote)',
    salary_min: 60,
    salary_max: 80,
    salary_currency: '$',
    posted_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Fix UI bugs and implement new features in Next.js app. 2+ years experience required.',
    requirements: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    contact_email: 'careers@techflow.dev',
    application_url: 'https://example.com/apply2',
    status: 'new',
    match_score: 78,
    company_logo: null,
    type: 'Contract',
    skill: 'React',
    notes: ''
  },
  {
    id: '3',
    title: 'AI Content Writer',
    company: 'ContentLab',
    location: 'Remote',
    salary_min: 40,
    salary_max: 60,
    salary_currency: '$',
    posted_date: new Date().toISOString(),
    description: 'Write engaging AI-generated content for blogs and social media. Experience with ChatGPT/Jasper preferred.',
    requirements: ['Content Writing', 'ChatGPT', 'SEO'],
    contact_email: 'editor@contentlab.io',
    application_url: 'https://example.com/apply3',
    status: 'new',
    match_score: 65,
    company_logo: null,
    type: 'Full-time',
    skill: 'Writing',
    notes: ''
  }
];

export default function DashboardPage() {
  // ---------- STATE ----------
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [credits, setCredits] = useState(3); // Start with 3 free credits
  const [selectedSkill, setSelectedSkill] = useState<string>('all'); // 'all' or specific skill

  // Filter leads based on selected skill
  const filteredLeads = selectedSkill === 'all'
    ? dummyLeads
    : dummyLeads.filter(lead => 
        lead.skill?.toLowerCase() === selectedSkill.toLowerCase()
      );

  // ---------- HANDLERS ----------
  const handleGeneratePitch = async (lead: Lead) => {
    if (credits > 0) {
      // Consume 1 credit
      setCredits(prev => prev - 1);
      // Here you would call your actual AI pitch generation API
      console.log(`Generating pitch for ${lead.title} – 1 credit used`);
      // Simulate async
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`✨ AI Pitch generated! (1 credit used, ${credits - 1} left)`);
    } else {
      // No credits left → open upgrade modal
      setIsProModalOpen(true);
    }
  };

  // ---------- REVENUE STATS (Dummy) ----------
  const totalLeads = dummyLeads.length;
  const creditsUsed = 3 - credits;
  const estimatedRevenue = creditsUsed * 5; // Assume $5 per lead generated

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar with Upgrade trigger */}
      <Navbar 
        onOpenPro={() => setIsProModalOpen(true)} 
        creditsLeft={credits} 
      />

      {/* Pro Upgrade Modal */}
      <UpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue & Lead Stats Card */}
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
              <p className="text-sm text-slate-600">Leads Generated</p>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR – Skill Switcher */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> Filter by Skill
                </h3>
                <SkillSwitcher 
                  selectedSkill={selectedSkill}
                  onSkillChange={setSelectedSkill}
                />
                <p className="text-xs text-slate-500 mt-4">
                  Showing {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
                </p>
              </div>
              {/* Quick Tip */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Pro Tip
                </h4>
                <p className="text-sm text-slate-600">
                  Use AI Pitch to stand out. Pro users get <span className="font-bold text-blue-600">50 pitches/month</span> and <span className="font-bold">10‑sec alerts</span>.
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT – Job Cards */}
          <section className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedSkill === 'all' ? 'All Recommended Leads' : `${selectedSkill} Leads`}
              </h2>
              <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                {filteredLeads.length} fresh gigs
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500">No leads found for this skill. Try another filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredLeads.map((lead) => (
                  <JobCard
                    key={lead.id}
                    lead={lead}
                    onContacted={async (id) => console.log('Contacted', id)}
                    onGeneratePitch={handleGeneratePitch}
                    onInterview={async (id) => console.log('Interview', id)}
                    onRejected={async (id) => console.log('Rejected', id)}
                    onAccepted={async (id) => console.log('Accepted', id)}
                    onAddNote={async (id, note) => console.log('Note added', id, note)}
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
