import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'leadgenai-auth-token',
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'leadgenai-web@1.0.0',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          is_pro: boolean;
          is_first_time_pro: boolean;
          last_credit_reset: string;
          subscription_end_date: string | null;
          selected_skill: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          skill: string;
          title: string;
          company: string;
          company_logo: string | null;
          location: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          description: string;
          requirements: string[];
          posted_date: string;
          application_url: string;
          source: string;
          contact_email: string | null;
          contact_phone: string | null;
          is_verified: boolean;
          match_score: number;
          ai_pitch_generated: boolean;
          status: 'new' | 'contacted' | 'interview' | 'rejected' | 'accepted';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'FREE_DAILY' | 'PRO_USAGE' | 'PURCHASE' | 'REFUND';
          amount: number;
          balance_after: number;
          description: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['credit_transactions']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['credit_transactions']['Insert']>;
      };
      pitch_generations: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string;
          pitch_content: string;
          tone: string;
          length: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pitch_generations']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['pitch_generations']['Insert']>;
      };
      user_activities: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          details: Record<string, any>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_activities']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_activities']['Insert']>;
      };
    };
    Views: {
      lead_stats: {
        Row: {
          user_id: string;
          total_leads: number;
          new_leads: number;
          contacted_leads: number;
          interview_leads: number;
          accepted_leads: number;
          avg_match_score: number;
        };
      };
      user_summary: {
        Row: {
          user_id: string;
          total_credits_used: number;
          total_pitches_generated: number;
          avg_response_time: number;
          success_rate: number;
        };
      };
    };
    Functions: {
      reset_daily_credits: {
        Args: Record<string, never>;
        Returns: void;
      };
      get_user_stats: {
        Args: { user_id: string };
        Returns: {
          total_leads: number;
          credits_remaining: number;
          is_pro: boolean;
          subscription_days_left: number;
        };
      };
      search_leads: {
        Args: {
          search_term: string;
          skill_filter: string;
          min_salary: number;
          max_salary: number;
          location_filter: string;
        };
        Returns: Database['public']['Tables']['leads']['Row'][];
      };
      generate_lead_summary: {
        Args: { lead_id: string };
        Returns: {
          summary: string;
          key_points: string[];
          suggested_action: string;
        };
      };
    };
  };
};

// Helper functions for common operations

/**
 * Get user profile with error handling
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
}

/**
 * Update user credits with transaction logging
 */
export async function updateUserCredits(
  userId: string,
  amount: number,
  type: Database['public']['Tables']['credit_transactions']['Row']['type'],
  description: string
) {
  try {
    // Get current credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('User profile not found');

    const newCredits = Math.max(0, profile.credits + amount);

    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Log transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type,
        amount,
        balance_after: newCredits,
        description,
        created_at: new Date().toISOString(),
      });

    if (transactionError) throw transactionError;

    return newCredits;
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

/**
 * Reset daily credits for free users
 */
export async function resetDailyCredits() {
  try {
    const { error } = await supabase.rpc('reset_daily_credits');
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error resetting daily credits:', error);
    throw error;
  }
}

/**
 * Search leads with filters
 */
export async function searchLeads(params: {
  skill: string;
  searchTerm?: string;
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('skill', params.skill)
      .order('posted_date', { ascending: false });

    if (params.searchTerm) {
      query = query.or(
        `title.ilike.%${params.searchTerm}%,company.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%`
      );
    }

    if (params.minSalary) {
      query = query.gte('salary_min', params.minSalary);
    }

    if (params.maxSalary) {
      query = query.lte('salary_max', params.maxSalary);
    }

    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, total: count || 0 };
  } catch (error) {
    console.error('Error searching leads:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates
 */
export function subscribeToUpdates(
  channel: string,
  callback: (payload: any) => void,
  filters?: Record<string, any>
) {
  const subscription = supabase
    .channel(channel)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leads',
        ...filters,
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Log user activity
 */
export async function logUserActivity(
  userId: string,
  action: string,
  details: Record<string, any> = {}
) {
  try {
    // Get IP and user agent if in browser
    let ipAddress = null;
    let userAgent = null;

    if (typeof window !== 'undefined') {
      // In production, you would get the IP from your backend
      userAgent = window.navigator.userAgent;
    }

    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    });

    if (error) console.error('Failed to log activity:', error);
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
}

/**
 * Health check for Supabase connection
 */
export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    return {
      connected: !error,
      timestamp: new Date().toISOString(),
      error: error?.message,
    };
  } catch (error: any) {
    return {
      connected: false,
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * Initialize database (for first-time setup)
 */
export async function initializeDatabase() {
  try {
    // Check if tables exist by trying to select from them
    const tables = ['profiles', 'leads', 'credit_transactions', 'pitch_generations'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table as any)
        .select('count')
        .limit(1);

      if (error && error.code === '42P01') {
        console.warn(`Table ${table} does not exist. Please run the SQL setup script.`);
        return {
          initialized: false,
          missingTables: [table],
          message: 'Database tables need to be created. Please run the setup script.',
        };
      }
    }

    return {
      initialized: true,
      message: 'Database is properly initialized.',
    };
  } catch (error: any) {
    console.error('Database initialization check failed:', error);
    return {
      initialized: false,
      error: error.message,
      message: 'Failed to check database initialization.',
    };
  }
}

// Export a singleton instance
export default supabase;
