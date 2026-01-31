import { Zap, ExternalLink } from 'lucide-react';

export default function JobCard({ title, source, time, budget, type }: any) {
  return (
    <div className="group p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-green-500/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-1">
            <Zap size={10} className="fill-green-500 text-green-500" />
            {source} • {time}
          </span>
          <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white">{title}</h3>
        </div>
        <span className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] font-bold text-zinc-400">
          {type}
        </span>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
        <span className="text-green-400 font-mono text-sm font-bold tracking-tight">{budget}</span>
        <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-500 transition-colors">
          Snipe Deal <ExternalLink size={14} />
        </button>
      </div>
    </div>
  )
}
