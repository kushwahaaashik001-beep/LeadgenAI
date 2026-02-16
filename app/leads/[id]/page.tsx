import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Calendar, DollarSign, Globe, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LeadDetailsPage({ params }: PageProps) {
  const { id } = params;

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to leads
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{lead.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {lead.platform || 'Direct'}
              </span>
              <span className="text-sm opacity-90">
                Posted {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Budget</div>
                <div className="font-semibold">
                  {lead.budget_numeric ? `${lead.budget_currency || '$'}${lead.budget_numeric}` : 'Negotiable'}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Skill</div>
                <div className="font-semibold">{lead.skill || 'Any'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Status</div>
                <div className="font-semibold capitalize">{lead.status || 'New'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Platform</div>
                <div className="font-semibold">{lead.platform || 'Direct'}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-slate-700 whitespace-pre-line">
                {lead.description || 'No description provided.'}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end pt-4 border-t">
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
