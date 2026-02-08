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
  private leadSubscribers: ((lead: Lead, isPro: boolean) => void)[] = []
  private metricsSubscribers: ((metrics: any) => void)[] = []

  constructor() {
    this.setupRealtime()
  }

  private setupRealtime() {
    this.channel = supabase
      .channel('optima-leads')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        async (payload) => {
          const newLead = payload.new as Lead
          
          // Check if lead qualifies for Pro users (high budget, verified)
          const isProLead = newLead.budget >= 500 && newLead.tier !== 'C'
          
          // Notify all subscribers with lead and qualification status
          this.leadSubscribers.forEach(callback => {
            callback(newLead, isProLead)
          })

          // Update metrics
          this.updateMetrics()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
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
        (payload) => {
          this.metricsSubscribers.forEach(callback => callback(payload.new))
        }
      )
      .subscribe()
  }

  subscribeToLeads(callback: (lead: Lead, isProLead: boolean) => void) {
    this.leadSubscribers.push(callback)
    return () => {
      this.leadSubscribers = this.leadSubscribers.filter(cb => cb !== callback)
    }
  }

  subscribeToMetrics(callback: (metrics: any) => void) {
    this.metricsSubscribers.push(callback)
    return () => {
      this.metricsSubscribers = this.metricsSubscribers.filter(cb => cb !== callback)
    }
  }

  async updateMetrics() {
    const { data } = await supabase.rpc('update_lead_metrics')
    return data
  }

  unsubscribe() {
    this.channel?.unsubscribe()
    this.leadSubscribers = []
    this.metricsSubscribers = []
  }
}

// Telegram Bot Integration for Pro Users
export class TelegramBotService {
  static async sendNotification(userId: string, lead: Lead) {
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

    return response.json()
  }

  static async connectTelegram(userId: string) {
    const { data } = await supabase.functions.invoke('generate-telegram-token', {
      body: { userId }
    })
    return data.token
  }
}

// AI Pitch Generator Service
export class AIPitchService {
  static async generatePitch(lead: Lead, userSkills: string[]): Promise<string> {
    // Check if user is Pro
    const { data: user } = await supabase
      .from('profiles')
      .select('is_pro, credits')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!user?.is_pro) {
      throw new Error('AI Pitch Generator requires PRO subscription')
    }

    // Deduct credits
    await CreditManager.deductCredits(user.data.user.id, 5, 'AI Pitch Generation')

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

    const data = await response.json()
    return data.pitch
  }

  static async savePitch(leadId: string, pitch: string) {
    const { data, error } = await supabase
      .from('lead_pitches')
      .insert({
        lead_id: leadId,
        pitch,
        used_at: new Date().toISOString()
      })

    if (error) throw error
    return data
  }
}

// Subscription Manager
export class SubscriptionManager {
  static async upgradeToPro(userId: string, plan: 'monthly' | 'yearly') {
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
  }

  static async cancelSubscription(userId: string) {
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
  }

  static async checkSubscriptionStatus(userId: string) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'past_due', 'cancelled'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return data
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
  }

  static async deductCredits(userId: string, amount: number, reason: string) {
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
  }

  static async addCredits(userId: string, amount: number, packageId?: string) {
    const { data, error } = await supabase.rpc('add_user_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_package_id: packageId
    })

    if (error) throw error
    return data
  }
}

// Lead Status Tracker
export class LeadStatusTracker {
  static async updateStatus(leadId: string, status: Lead['status'], userId: string) {
    const updateData: any = { status }
    
    // Set timestamps based on status
    if (status === 'applied') {
      updateData.applied_at = new Date().toISOString()
    } else if (status === 'replied') {
      updateData.replied_at = new Date().toISOString()
    } else if (status === 'hired') {
      updateData.hired_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_lead_status')
      .upsert({
        lead_id: leadId,
        user_id: userId,
        status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'lead_id,user_id'
      })

    if (error) throw error
    return data
  }

  static async getUserLeads(userId: string, filters?: {
    status?: Lead['status']
    limit?: number
    offset?: number
  }) {
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
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }
}

// Analytics Service
export class AnalyticsService {
  static async getUserAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year') {
    const { data, error } = await supabase.rpc('get_user_analytics', {
      p_user_id: userId,
      p_timeframe: timeframe
    })

    if (error) throw error
    return data
  }

  static async getPlatformAnalytics() {
    const { data, error } = await supabase.rpc('get_platform_analytics')

    if (error) throw error
    return data
  }

  static async getSkillDemand() {
    const { data, error } = await supabase.rpc('get_skill_demand_analytics')

    if (error) throw error
    return data
  }
}

// Export instances
export const leadMonitor = new RealTimeLeadMonitor()
