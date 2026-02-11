"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

// Subscription pricing configuration
const SUBSCRIPTION_PRICES = {
  firstTimePro: 199,
  renewalPro: 599,
} as const;

// Available skills (23 skills)
export const AVAILABLE_SKILLS = [
  'React Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Scientist',
  'AI/ML Engineer',
  'Mobile App Developer',
  'UI/UX Designer',
  'Product Manager',
  'Digital Marketer',
  'Content Writer',
  'SEO Specialist',
  'Blockchain Developer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Game Developer',
  'QA Engineer',
  'Business Analyst',
  'Sales Executive',
  'Social Media Manager',
  'E-commerce Specialist',
  'Video Editing'
] as const;

export type SkillType = typeof AVAILABLE_SKILLS[number];

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  is_pro: boolean;
  is_first_time_pro: boolean;
  last_credit_reset: string;
  subscription_end_date?: string | null;
  selected_skill: SkillType;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'FREE_DAILY' | 'PRO_USAGE' | 'PURCHASE' | 'REFUND';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  credits: number;
  isPro: boolean;
  isFirstTimePro: boolean;
  subscriptionEndDate: string | null;
  selectedSkill: SkillType;
  availableSkills: readonly SkillType[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deductCredit: (amount?: number) => Promise<boolean>;
  resetDailyCredits: () => Promise<void>;
  checkCreditReset: () => Promise<void>;
  upgradeToPro: (paymentMethod?: string) => Promise<void>;
  cancelProSubscription: () => Promise<void>;
  getProPrice: () => number;
  setSelectedSkill: (skill: SkillType) => Promise<void>;
  subscribeToUserUpdates: () => void;
  unsubscribeFromUserUpdates: () => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, body: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number>(3);
  const [selectedSkill, setSelectedSkillState] = useState<SkillType>('React Developer');
  const router = useRouter();
  const pathname = usePathname();

  // Initialize user session
  useEffect(() => {
    let mounted = true;

    const initializeUser = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          // For development/demo, check if we're on a public page
          if (!pathname?.includes('/dashboard') && !pathname?.includes('/pro')) {
            await createAnonymousUser();
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCredits(3);
          setSelectedSkillState('React Developer');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      unsubscribeFromUserUpdates();
    };
  }, [pathname]);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          await createNewProfile(userId);
          return;
        }
        throw error;
      }

      if (profile) {
        const typedProfile = profile as UserProfile;
        setUser(typedProfile);
        setCredits(typedProfile.credits);
        setSelectedSkillState(typedProfile.selected_skill || 'React Developer');
        
        // Check if daily credits need reset
        await checkCreditReset();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  // Create new profile for existing auth user
  const createNewProfile = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) throw new Error('No auth user found');

      const newProfile = {
        id: userId,
        email: authUser.user.email!,
        full_name: authUser.user.user_metadata?.full_name || '',
        credits: 3,
        is_pro: false,
        is_first_time_pro: true,
        last_credit_reset: new Date().toISOString(),
        subscription_end_date: null,
        selected_skill: 'React Developer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (error) throw error;

      setUser(newProfile as UserProfile);
      setCredits(3);
    } catch (error) {
      console.error('Error creating new profile:', error);
    }
  };

  // Create anonymous user for demo
  const createAnonymousUser = async () => {
    try {
      const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      
      const newUser: UserProfile = {
        id: anonymousId,
        email: `${anonymousId}@anonymous.com`,
        credits: 3,
        is_pro: false,
        is_first_time_pro: true,
        last_credit_reset: new Date().toISOString(),
        subscription_end_date: null,
        selected_skill: 'React Developer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      setCredits(3);
    } catch (error) {
      console.error('Error creating anonymous user:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw new Error(error.message || 'Login failed');
    }
  };

  // Signup function
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Profile will be created via database trigger or in fetchUserProfile
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw new Error(error.message || 'Signup failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCredits(3);
      setSelectedSkillState('React Developer');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw new Error(error.message || 'Logout failed');
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser(prev => prev ? { ...prev, ...updatedData } : null);
      
      // Update credits if changed
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      throw new Error(error.message || 'Update profile failed');
    }
  };

  // Deduct credit from user
  const deductCredit = async (amount: number = 1): Promise<boolean> => {
    if (!user) throw new Error('No user logged in');

    if (user.is_pro) {
      // Pro users have unlimited credits for lead viewing
      return true;
    }

    if (credits < amount) {
      throw new Error('Insufficient credits. Please upgrade to Pro.');
    }

    const newCredits = credits - amount;
    
    try {
      // Update credits in database
      await updateProfile({ credits: newCredits });
      
      // Log credit transaction
      await logCreditTransaction({
        user_id: user.id,
        type: 'FREE_DAILY',
        amount: -amount,
        balance_after: newCredits,
        description: `Credit used for ${selectedSkill} lead generation`,
      });

      setCredits(newCredits);
      return true;
    } catch (error) {
      console.error('Error deducting credit:', error);
      throw error;
    }
  };

  // Log credit transaction
  const logCreditTransaction = async (transaction: Omit<CreditTransaction, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('credit_transactions')
        .insert([{
          ...transaction,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  };

  // Reset daily credits for free users
  const resetDailyCredits = async () => {
    if (!user || user.is_pro) return;

    const now = new Date();
    const lastReset = new Date(user.last_credit_reset);
    
    // Check if it's a new day (timezone aware)
    const isNewDay = now.getDate() !== lastReset.getDate() || 
                    now.getMonth() !== lastReset.getMonth() || 
                    now.getFullYear() !== lastReset.getFullYear();

    if (isNewDay) {
      try {
        await updateProfile({
          credits: 3,
          last_credit_reset: now.toISOString(),
        });
        
        setCredits(3);
        
        // Log free credit reset
        await logCreditTransaction({
          user_id: user.id,
          type: 'FREE_DAILY',
          amount: 3,
          balance_after: 3,
          description: 'Daily free credits reset',
        });
      } catch (error) {
        console.error('Error resetting credits:', error);
      }
    }
  };

  // Check and reset credits if needed
  const checkCreditReset = async () => {
    if (!user || user.is_pro) return;
    await resetDailyCredits();
  };

  // Upgrade to Pro subscription
  const upgradeToPro = async (paymentMethod: string = 'demo') => {
    if (!user) throw new Error('No user logged in');

    const price = getProPrice();
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 month subscription

    try {
      // TODO: Integrate with actual payment gateway (Razorpay/Stripe)
      console.log(`Processing ${paymentMethod} payment of ₹${price} for Pro subscription`);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user profile
      const updatedProfile = {
        is_pro: true,
        is_first_time_pro: false,
        subscription_end_date: subscriptionEnd.toISOString(),
        credits: user.credits + 50, // Add bonus credits
      };

      await updateProfile(updatedProfile);

      // Log transaction
      await logCreditTransaction({
        user_id: user.id,
        type: 'PURCHASE',
        amount: 50,
        balance_after: user.credits + 50,
        description: `Upgraded to Pro subscription - ₹${price}`,
      });

      // Send notification
      sendNotification('🎉 Welcome to Pro!', 
        'You now have access to premium features including AI Pitch and real-time notifications!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Upgrade error:', error.message);
      throw new Error(error.message || 'Upgrade failed');
    }
  };

  // Cancel Pro subscription
  const cancelProSubscription = async () => {
    if (!user) throw new Error('No user logged in');

    try {
      await updateProfile({
        is_pro: false,
        subscription_end_date: null,
      });

      sendNotification('Subscription Cancelled', 
        'Your Pro subscription has been cancelled. You will revert to free tier.');

    } catch (error: any) {
      console.error('Cancel subscription error:', error.message);
      throw new Error(error.message || 'Cancel subscription failed');
    }
  };

  // Get current Pro price
  const getProPrice = (): number => {
    if (!user) return SUBSCRIPTION_PRICES.firstTimePro;
    
    return user.is_first_time_pro 
      ? SUBSCRIPTION_PRICES.firstTimePro 
      : SUBSCRIPTION_PRICES.renewalPro;
  };

  // Set selected skill
  const setSelectedSkill = async (skill: SkillType) => {
    setSelectedSkillState(skill);
    
    if (user) {
      try {
        await updateProfile({ selected_skill: skill });
      } catch (error) {
        console.error('Error updating skill:', error);
      }
    }
  };

  // Request notification permission
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

  // Send notification
  const sendNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon.png',
          });
        }
      });
    }
  };

  // Subscribe to real-time user updates
  const subscribeToUserUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel(`user-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updatedUser = payload.new as UserProfile;
          setUser(updatedUser);
          setCredits(updatedUser.credits);
          
          // Send notification for pro activation
          if (updatedUser.is_pro && user && !user.is_pro) {
            sendNotification('Pro Activated! 🚀', 
              'Your Pro subscription is now active! Enjoy premium features.');
          }
        }
      )
      .subscribe();

    return channel;
  };

  // Unsubscribe from updates
  const unsubscribeFromUserUpdates = () => {
    supabase.removeAllChannels();
  };

  // Context value
  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    credits,
    isPro: user?.is_pro || false,
    isFirstTimePro: user?.is_first_time_pro || true,
    subscriptionEndDate: user?.subscription_end_date || null,
    selectedSkill,
    availableSkills: AVAILABLE_SKILLS,
    login,
    signup,
    logout,
    updateProfile,
    deductCredit,
    resetDailyCredits,
    checkCreditReset,
    upgradeToPro,
    cancelProSubscription,
    getProPrice,
    setSelectedSkill,
    subscribeToUserUpdates,
    unsubscribeFromUserUpdates,
    requestNotificationPermission,
    sendNotification,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Custom hook for credit management
export function useCredits() {
  const { credits, deductCredit, user } = useUser();
  
  const canUseCredits = (amount: number = 1): boolean => {
    if (!user) return false;
    if (user.is_pro) return true;
    return credits >= amount;
  };

  const useCredits = async (amount: number = 1): Promise<boolean> => {
    if (!canUseCredits(amount)) {
      throw new Error('Insufficient credits');
    }
    
    if (!user?.is_pro) {
      return await deductCredit(amount);
    }
    
    return true;
  };

  return {
    credits,
    canUseCredits,
    useCredits,
    isPro: user?.is_pro || false,
  };
}

// Custom hook for subscription
export function useSubscription() {
  const { isPro, isFirstTimePro, upgradeToPro, cancelProSubscription, getProPrice, subscriptionEndDate } = useUser();
  
  const proPrice = getProPrice();
  const isRenewal = !isFirstTimePro;
  
  return {
    isPro,
    isFirstTimePro,
    proPrice,
    isRenewal,
    subscriptionEndDate,
    upgradeToPro,
    cancelProSubscription,
  };
}

// Custom hook for skill management
export function useSkills() {
  const { selectedSkill, setSelectedSkill, availableSkills } = useUser();
  
  return {
    selectedSkill,
    setSelectedSkill,
    availableSkills,
  };
}
