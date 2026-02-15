'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import JobCard, { Lead } from '@/components/JobCard';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setLeads(data || []);
      } catch (err) {
        console.error('Error fetching leads:', err);
        toast.error('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();

    const channel = supabase
      .channel('homepage-leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => [newLead, ...prev]);
          toast.success('🔥 New lead arrived!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Placeholder – replace with your actual pitch logic
  const handleGeneratePitch = async (lead: Lead) => {
    toast.success(`Demo: AI Pitch for "${lead.title}"`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next <span className="text-yellow-300">Freelance Opportunity</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Real-time leads from Upwork, Fiverr, and more. Apply before others.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Latest Opportunities</h2>
          <span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
            {leads.length} fresh leads
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500">No leads yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <JobCard
                key={lead.id}
                lead={lead}
                onGeneratePitch={handleGeneratePitch}
                creditsRemaining={3}   // Replace with real user credits later
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
