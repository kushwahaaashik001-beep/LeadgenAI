import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Super Admin Client for bulk database updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // 1. Vercel Cron Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized Cron Execution" }, { status: 401 });
    }

    // 2. Bulk Update: Sabhi FREE users ke credits 3 kardo
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ daily_credits: 3 })
      .eq('plan', 'FREE');

    if (error) throw error;

    console.log("✅ Daily credits reset successful for FREE users.");
    return NextResponse.json({ success: true, message: "Credits reset successfully to 3" });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset credits" }, { status: 500 });
  }
}
