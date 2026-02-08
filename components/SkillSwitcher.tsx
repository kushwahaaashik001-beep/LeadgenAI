'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Code, 
  PenTool, 
  FileText,
  Mic,
  Camera,
  Palette,
  TrendingUp,
  Plus,
  X,
  Check,
  Lock
} from 'lucide-react'

const allSkills = [
  { id: 'video-editing', name: 'Video Editing', icon: Video, color: 'from-purple-500 to-pink-500', pro: false },
  { id: 'web-dev', name: 'Web Development', icon: Code, color: 'from-blue-500 to-cyan-500', pro: false },
  { id: 'ui-ux', name: 'UI/UX Design', icon: Palette, color: 'from-green-500 to-emerald-500', pro: false },
  { id: 'content', name: 'Content Writing', icon: FileText, color: 'from-yellow-500 to-orange-500', pro: false },
  { id: 'graphic-design', name: 'Graphic Design', icon: PenTool, color: 'from-red-500 to-pink-500', pro: true },
  { id: 'voiceover', name: 'Voice Over', icon: Mic, color: 'from-indigo-500 to-purple-500', pro: true },
  { id: 'motion-graphics', name: 'Motion Graphics', icon: Camera, color: 'from-teal-500 to-green-500', pro: true },
  { id: 'marketing', name: 'Digital Marketing', icon: TrendingUp, color: 'from-orange-500 to-red-500', pro: true },
]

interface SkillSwitcherProps {
  selectedSkills: string[]
  onChange: (skills: string[]) => void
  isPro: boolean
}

export default function SkillSwitcher({ selectedSkills, onChange, isPro }: SkillSwitcherProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSkillToggle = (skillId: string) => {
    if (!isPro && allSkills.find(s => s.id === skillId)?.pro) {
      return // Don't allow non-pro users to select pro skills
    }

    if (selectedSkills.includes(skillId)) {
      onChange(selectedSkills.filter(id => id !== skillId))
    } else {
      if (selectedSkills.length >= (isPro ? 10 : 3)) {
        // Show error or notification
        return
      }
      onChange([...selectedSkills, skillId])
    }
  }

  const getSkillIcon = (skillId: string) => {
    const skill = allSkills.find(s => s.id === skillId)
    return skill ? <skill.icon className="h-4 w-4" /> : <Code className="h-4 w-4" />
  }

  const filteredSkills = allSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {selectedSkills.map(skillId => {
            const skill = allSkills.find(s => s.id === skillId)
            if (!skill) return null

            return (
              <motion.div
                key={skillId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`relative group ${!isPro && skill.pro ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => handleSkillToggle(skillId)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${skill.color} text-white font-medium`}
                >
                  <skill.icon className="h-4 w-4" />
                  <span>{skill.name}</span>
                  <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                </button>
                
                {!isPro && skill.pro && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="h-3 w-3 text-yellow-400" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add Skill Button */}
        {selectedSkills.length < (isPro ? 10 : 3) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </motion.button>
        )}
      </div>

      {/* Skill Limit Info */}
      <div className="text-sm text-gray-400">
        {isPro ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-400" />
            <span>PRO: Unlimited skills ({selectedSkills.length}/10 selected)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-yellow-400" />
            <span>FREE: {selectedSkills.length}/3 skills selected</span>
          </div>
        )}
      </div>

      {/* Add Skills Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute z-50 mt-2 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Add Skills</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {filteredSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill.id)
                const isProSkill = skill.pro && !isPro
                
                return (
                  <button
                    key={skill.id}
                    onClick={() => !isProSkill && handleSkillToggle(skill.id)}
                    disabled={isProSkill}
                    className={`p-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${skill.color} text-white`
                        : isProSkill
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-4 w-4" />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      {isProSkill && <Lock className="h-3 w-3" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Pro Upgrade Prompt */}
            {!isPro && filteredSkills.some(s => s.pro) && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <Lock className="h-4 w-4" />
                  <span>Upgrade to PRO to access premium skills</span>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={() => setIsAdding(false)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Search icon component
const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
