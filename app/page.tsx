"use client";
import { useState } from 'react';
import JobCard from '@/components/JobCard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Freelancer');
  const categories = ['Freelancer', 'Influencer', 'Job', 'Internship'];

  return (
    <main className="max-w-2xl mx-auto p-4 pt-8">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">Snipe your next deal.</h2>
        <p className="text-zinc-500 text-lg">Real-time opportunities, delivered in 10 seconds.</p>
      </header>

      {/* Tabs Section */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-2 border-b border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === cat 
              ? 'bg-green-500 text-black' 
              : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {/* Placeholder Lead */}
        <JobCard 
          title="Video Editor for Finance Channel"
          source="Twitter"
          time="8s ago"
          budget="₹25,000 - ₹40,000"
          type={activeTab}
        />
        <JobCard 
          title="React Developer Needed (Remote)"
          source="Reddit"
          time="15s ago"
          budget="₹1.2L / mo"
          type={activeTab}
        />
      </div>
    </main>
  )
}
