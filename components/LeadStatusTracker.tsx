'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Award,
  XCircle,
  Calendar,
  TrendingUp,
  DollarSign,
  Zap,
  Edit,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

interface LeadStatusTrackerProps {
  lead: any
  onStatusChange: (status: string) => void
}

const statusOptions = [
  { id: 'new', label: 'New', icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  { id: 'applied', label: 'Applied', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'replied', label: 'Replied', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'hired', label: 'Hired', icon: Award, color: 'text-green-400', bg: 'bg-green-500/20' },
  { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
]

const statusOrder = ['new', 'applied', 'replied', 'hired', 'rejected']

export default function LeadStatusTracker({ lead, onStatusChange }: LeadStatusTrackerProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [notes, setNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  const currentStatusIndex = statusOrder.indexOf(lead?.status || 'new')
  
  const getStatusIcon = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId)
    return status ? <status.icon className="h-4 w-4" /> : <Clock className="h-4 w-4" />
  }

  const getStatusColor = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId)
    return status ? status.color : 'text-gray-400'
  }

  const getStatusBg = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId)
    return status ? status.bg : 'bg-gray-500/20'
  }

  const handleStatusClick = (statusId: string) => {
    onStatusChange(statusId)
    setShowStatusMenu(false)
  }

  const handleAddNote = () => {
    if (notes.trim()) {
      // Save note logic here
      setNotes('')
    }
  }

  const calculateProbability = (status: string) => {
    const probabilities = {
      'new': 15,
      'applied': 30,
      'replied': 60,
      'hired': 100,
      'rejected': 0
    }
    return probabilities[status as keyof typeof probabilities] || 15
  }

  const probability = calculateProbability(lead?.status || 'new')

  return (
    <div className="space-y-4">
      {/* Status Progress Bar */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-800 z-0"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 z-10 transition-all duration-500"
          style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
        ></div>

        {/* Status Points */}
        <div className="relative flex justify-between z-20">
          {statusOptions.map((status, index) => {
            const isActive = statusOrder.indexOf(lead?.status || 'new') >= index
            const isCurrent = lead?.status === status.id
            
            return (
              <div key={status.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleStatusClick(status.id)}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? status.bg
                      : 'bg-gray-800'
                  } ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-purple-500' : ''}`}
                >
                  <status.icon className={`h-5 w-5 ${isActive ? status.color : 'text-gray-600'}`} />
                  
                  {/* Current Status Indicator */}
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
                
                <span className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {status.label}
                </span>
                
                {/* Date indicator for current status */}
                {isCurrent && lead?.[`${status.id}_at`] && (
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(lead[`${status.id}_at`]).toLocaleDateString()}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Info Card */}
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getStatusBg(lead?.status || 'new')}`}>
              {getStatusIcon(lead?.status || 'new')}
            </div>
            <div>
              <h3 className="font-medium">Current Status</h3>
              <p className={`text-sm font-bold ${getStatusColor(lead?.status || 'new')}`}>
                {statusOptions.find(s => s.id === lead?.status)?.label || 'New'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Success Probability</div>
            <div className="text-2xl font-bold text-green-400">{probability}%</div>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hire Probability</span>
            <span className="font-medium">{probability}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${probability}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                probability > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                probability > 40 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {lead?.budget ? `$${lead.budget.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-xs text-gray-400">Budget</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {lead?.applied_at ? 'Applied' : 'Not Applied'}
            </div>
            <div className="text-xs text-gray-400">Application</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {lead?.hired_at ? 'Hired!' : 'Pending'}
            </div>
            <div className="text-xs text-gray-400">Result</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Update Status
        </button>
        
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 rounded-lg">
          <ExternalLink className="h-4 w-4" />
        </button>
        
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Status Menu Dropdown */}
      {showStatusMenu && (
        <div className="absolute z-10 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-2 min-w-[200px]">
          <div className="space-y-1">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusClick(status.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 ${
                  lead?.status === status.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className={`p-1.5 rounded ${getStatusBg(status.id)}`}>
                  <status.icon className={`h-3.5 w-3.5 ${getStatusColor(status.id)}`} />
                </div>
                <span className="font-medium">{status.label}</span>
              </button>
            ))}
          </div>
          
          {/* Add Note Section */}
          <div className="mt-3 pt-3 border-t border-gray-800">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              rows={2}
            />
            <button
              onClick={handleAddNote}
              className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
            >
              Add Note
            </button>
          </div>
        </div>
      )}

      {/* Timeline Info */}
      {(lead?.applied_at || lead?.replied_at || lead?.hired_at) && (
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Timeline
          </h4>
          <div className="space-y-2 text-sm">
            {lead?.applied_at && (
              <div className="flex justify-between">
                <span className="text-gray-400">Applied:</span>
                <span className="font-medium">
                  {new Date(lead.applied_at).toLocaleDateString()} at {new Date(lead.applied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            {lead?.replied_at && (
              <div className="flex justify-between">
                <span className="text-gray-400">Client replied:</span>
                <span className="font-medium text-yellow-400">
                  {new Date(lead.replied_at).toLocaleDateString()}
                </span>
              </div>
            )}
            {lead?.hired_at && (
              <div className="flex justify-between">
                <span className="text-gray-400">Hired on:</span>
                <span className="font-medium text-green-400">
                  {new Date(lead.hired_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
