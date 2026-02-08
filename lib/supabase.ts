import { createClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Types
export interface Lead {
  id: string
  url: string
  title: string
  description: string
  budget: number
  currency: string
  tier: 'S' | 'A' | 'B' | 'C'
  confidence: number
  skills: string[]
  client_history: string
  location: string
  timezone: string
  status: 'new' | 'applied' | 'replied' | 'hired' | 'rejected'
  applied_at?: string
  replied_at?: string
  hired_at?: string
  ai_pitch?: string
  telegram_notified: boolean
  email_notified: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_pro: boolean
  telegram_id?: string
  telegram_username?: string
  whatsapp_number?: string
  credits: number
  daily_snipes: number
  total_snipes: number
  skills: string[]
  subscription_id?: string
  subscription_plan: 'free' | 'pro' | 'enterprise'
  subscription_ends_at?: string
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  package_id?: string
  credits_before: number
  credits_after: number
  description: string
  created_at: string
}

// Real-time Lead Monitor with Pro/FREE differentiation
export class RealTimeLeadMonitor {
  private channel: RealtimeChannel | null = null
  private leadSubscribers: ((lead: Lead, isProLead: boolean) => void)[] = []
  private metricsSubscribers: ((metrics: any) => void)[] = []

  constructor() {
    this.setupRealtime()
  }

  // FIXED: Duplicate setupRealtime method removed
  private setupRealtime() {
    try {
      this.channel = supabase
        .channel('optima-leads')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'leads'
          },
          async (payload: any) => {
            const newLead = payload.new as Lead
            
            // Check if lead qualifies for Pro users (high budget, verified)
            const isProLead = newLead.budget >= 500 && newLead.tier !== 'C'
            
            // Notify all subscribers with lead and qualification status
            this.leadSubscribers.forEach(callback => {
              callback(newLead, isProLead)
            })

            // Update metrics
            await this.updateMetrics()
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'leads'
          },
          (payload: any) => {
            const updatedLead = payload.new as Lead
            this.leadSubscribers.forEach(callback => {
              callback(updatedLead, updatedLead.budget >= 500)
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'lead_metrics'
          },
          (payload: any) => {
            this.metricsSubscribers.forEach(callback => callback(payload.new))
          }
        )
        .subscribe((status: any) => {
          console.log('Realtime status:', status)
        })
    } catch (error) {
      console.error('Error setting up realtime:', error)
    }
  }

  // FIXED: Simplified subscribe method for page.tsx
  subscribe(callback: (lead: Lead, isProLead: boolean) => void) {
    this.leadSubscribers.push(callback)
    
    // Return unsubscribe function to clean up
    return () => {
      this.leadSubscribers = this.leadSubscribers.filter(cb => cb !== callback)
    }
  }

  // FIXED: Removed duplicate method name
  subscribeToMetrics(callback: (metrics: any) => void) {
    this.metricsSubscribers.push(callback)
    return () => {
      this.metricsSubscribers = this.metricsSubscribers.filter(cb => cb !== callback)
    }
  }

  private async updateMetrics() {
    try {
      const { data } = await supabase.rpc('update_lead_metrics')
      return data
    } catch (error) {
      console.error('Error updating metrics:', error)
      return null
    }
  }

  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel)
    }
    this.leadSubscribers = []
    this.metricsSubscribers = []
  }
}

// Telegram Bot Integration for Pro Users
export class TelegramBotService {
  static async sendNotification(userId: string, lead: Lead) {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('telegram_id, is_pro')
        .eq('id', userId)
        .single()

      if (!user?.is_pro || !user.telegram_id) return

      const message = `
🎯 *NEW SNIPE ALERT!*
*${lead.title}*
📍 ${lead.location}
💰 $${lead.budget.toLocaleString()}
⚡ Tier ${lead.tier}

${lead.description?.substring(0, 100)}...

[View Lead](${lead.url})
      `.trim()

      // Call Telegram bot API
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user.telegram_id,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: 'Generate AI Pitch', callback_data: `generate_pitch_${lead.id}` },
              { text: 'Apply Now', url: lead.url }
            ]]
          }
        })
      })

      return await response.json()
    } catch (error) {
      console.error('Error sending Telegram notification:', error)
      return null
    }
  }

  static async connectTelegram(userId: string) {
    try {
      const { data } = await supabase.functions.invoke('generate-telegram-token', {
        body: { userId }
      })
      return data?.token
    } catch (error) {
      console.error('Error connecting Telegram:', error)
      return null
    }
  }
}

// AI Pitch Generator Service
export class AIPitchService {
  static async generatePitch(lead: Lead, userSkills: string[]): Promise<string | null> {
    try {
      // Check if user is Pro
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro, credits')
        .eq('id', user.id)
        .single()

      if (!profile?.is_pro) {
        throw new Error('AI Pitch Generator requires PRO subscription')
      }

      // Deduct credits
      await CreditManager.deductCredits(user.id, 5, 'AI Pitch Generation')

      // Call AI API (Gemini/Groq)
      const prompt = `
Generate a professional pitch for this freelance opportunity:

Client Post: "${lead.title}"
Description: "${lead.description}"
Budget: ${lead.budget} ${lead.currency}
Required Skills: ${lead.skills.join(', ')}
Client History: ${lead.client_history}

My Skills: ${userSkills.join(', ')}

Create a personalized pitch that:
1. Shows understanding of their needs
2. Highlights relevant experience
3. Includes specific examples
4. Has a clear call-to-action
5. Is friendly but professional

Format in markdown with bullet points.
      `.trim()

      const response = await fetch('/api/ai/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('AI service failed')

      const data = await response.json()
      return data.pitch
    } catch (error) {
      console.error('Error generating AI pitch:', error)
      return null
    }
  }

  static async savePitch(leadId: string, pitch: string) {
    try {
      const { data, error } = await supabase
        .from('lead_pitches')
        .insert({
          lead_id: leadId,
          pitch,
          used_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving pitch:', error)
      return null
    }
  }
}

// Subscription Manager
export class SubscriptionManager {
  static async upgradeToPro(userId: string, plan: 'monthly' | 'yearly') {
    try {
      const price = plan === 'monthly' ? 2499 : 24999 // ₹2,499/month or ₹24,999/year
      
      const { data: session } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId,
          price,
          plan,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/dashboard?upgrade=cancelled`
        }
      })

      if (session?.url) {
        window.location.href = session.url
      }
      return session
    } catch (error) {
      console.error('Error upgrading to pro:', error)
      return null
    }
  }

  static async cancelSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          cancel_at_period_end: true 
        })
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return null
    }
  }

  static async checkSubscriptionStatus(userId: string) {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'past_due', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return data
    } catch (error) {
      console.error('Error checking subscription:', error)
      return null
    }
  }
}

// Credit Manager with Free/Pro logic
export class CreditManager {
  static async getBalance(userId: string): Promise<{
    credits: number
    daily_snipes: number
    is_pro: boolean
    unlimited: boolean
  }> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('credits, daily_snipes, is_pro')
        .eq('id', userId)
        .single()

      if (!data) return { credits: 0, daily_snipes: 0, is_pro: false, unlimited: false }

      // Pro users get unlimited daily snipes
      const unlimited = data.is_pro
      const daily_snipes = unlimited ? Infinity : Math.max(0, 5 - data.daily_snipes)

      return {
        credits: data.credits,
        daily_snipes,
        is_pro: data.is_pro,
        unlimited
      }
    } catch (error) {
      console.error('Error getting balance:', error)
      return { credits: 0, daily_snipes: 0, is_pro: false, unlimited: false }
    }
  }

  static async deductCredits(userId: string, amount: number, reason: string) {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('credits, is_pro')
        .eq('id', userId)
        .single()

      if (!user) throw new Error('User not found')

      // Pro users don't deduct credits for basic operations
      if (user.is_pro && amount <= 10) {
        return { success: true, credits_remaining: user.credits }
      }

      if (user.credits < amount) {
        throw new Error('Insufficient credits')
      }

      const { data, error } = await supabase.rpc('deduct_user_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error deducting credits:', error)
      throw error
    }
  }

  static async addCredits(userId: string, amount: number, packageId?: string) {
    try {
      const { data, error } = await supabase.rpc('add_user_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_package_id: packageId
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding credits:', error)
      throw error
    }
  }

  static async getTransactions(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as CreditTransaction[]
    } catch (error) {
      console.error('Error getting transactions:', error)
      return []
    }
  }
}

// Lead Status Tracker
export class LeadStatusTracker {
  static async updateStatus(leadId: string, status: Lead['status'], userId: string) {
    try {
      const updateData: any = { status }
      
      // Set timestamps based on status
      const now = new Date().toISOString()
      if (status === 'applied') {
        updateData.applied_at = now
      } else if (status === 'replied') {
        updateData.replied_at = now
      } else if (status === 'hired') {
        updateData.hired_at = now
      }

      const { data, error } = await supabase
        .from('user_lead_status')
        .upsert({
          lead_id: leadId,
          user_id: userId,
          status,
          updated_at: now
        }, {
          onConflict: 'lead_id,user_id'
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating lead status:', error)
      return null
    }
  }

  static async getUserLeads(userId: string, filters?: {
    status?: Lead['status']
    limit?: number
    offset?: number
  }) {
    try {
      let query = supabase
        .from('user_lead_status')
        .select(`
          *,
          leads (*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        const limit = filters.limit || 50
        query = query.range(filters.offset, filters.offset + limit - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user leads:', error)
      return []
    }
  }

  static async getLeadStats(userId: string) {
    try {
      const { data, error } = await supabase.rpc('get_user_lead_stats', {
        p_user_id: userId
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting lead stats:', error)
      return null
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async getUserAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year') {
    try {
      const { data, error } = await supabase.rpc('get_user_analytics', {
        p_user_id: userId,
        p_timeframe: timeframe
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user analytics:', error)
      return null
    }
  }

  static async getPlatformAnalytics() {
    try {
      const { data, error } = await supabase.rpc('get_platform_analytics')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting platform analytics:', error)
      return null
    }
  }

  static async getSkillDemand() {
    try {
      const { data, error } = await supabase.rpc('get_skill_demand_analytics')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting skill demand:', error)
      return null
    }
  }

  static async getRevenueAnalytics(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.rpc('get_revenue_analytics', {
        p_start_date: startDate,
        p_end_date: endDate
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting revenue analytics:', error)
      return null
    }
  }
}

// Database Functions (RPC calls for complex operations)
export class DatabaseFunctions {
  static async createLead(newLead: Partial<Lead>) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...newLead,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          telegram_notified: false,
          email_notified: false
        }])
        .select()
        .single()

      if (error) throw error
      return data as Lead
    } catch (error) {
      console.error('Error creating lead:', error)
      return null
    }
  }

  static async updateLead(leadId: string, updates: Partial<Lead>) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      return data as Lead
    } catch (error) {
      console.error('Error updating lead:', error)
      return null
    }
  }

  static async deleteLead(leadId: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting lead:', error)
      return false
    }
  }

  static async getRecentLeads(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as Lead[]
    } catch (error) {
      console.error('Error getting recent leads:', error)
      return []
    }
  }

  static async searchLeads(query: string, filters?: {
    minBudget?: number
    maxBudget?: number
    skills?: string[]
    location?: string
    tier?: string[]
  }) {
    try {
      let supabaseQuery = supabase
        .from('leads')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

      if (filters?.minBudget) {
        supabaseQuery = supabaseQuery.gte('budget', filters.minBudget)
      }

      if (filters?.maxBudget) {
        supabaseQuery = supabaseQuery.lte('budget', filters.maxBudget)
      }

      if (filters?.skills && filters.skills.length > 0) {
        supabaseQuery = supabaseQuery.contains('skills', filters.skills)
      }

      if (filters?.location) {
        supabaseQuery = supabaseQuery.ilike('location', `%${filters.location}%`)
      }

      if (filters?.tier && filters.tier.length > 0) {
        supabaseQuery = supabaseQuery.in('tier', filters.tier)
      }

      const { data, error } = await supabaseQuery
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      return data as Lead[]
    } catch (error) {
      console.error('Error searching leads:', error)
      return []
    }
  }
}

// Utility functions for common operations
export const supabaseUtils = {
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  },

  async getUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  },

  async checkIfUserExists(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      return !error && data !== null
    } catch (error) {
      return false
    }
  }
}

// Export instances
export const leadMonitor = new RealTimeLeadMonitor()

// Default exports for easy imports
export default {
  supabase,
  leadMonitor,
  TelegramBotService,
  AIPitchService,
  SubscriptionManager,
  CreditManager,
  LeadStatusTracker,
  AnalyticsService,
  DatabaseFunctions,
  supabaseUtils
}
