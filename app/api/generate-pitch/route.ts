import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Groq from 'groq-sdk';
import { randomUUID } from 'crypto';

// ==================== Configuration ====================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: GROQ_API_KEY || '',
});

// Rate limiting – per user, per minute (in‑memory, for development only)
// For production, replace with Redis/Upstash to persist across serverless invocations
const RATE_LIMIT_WINDOW_MS = 60 * 1000;          // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;               // 5 requests per minute per user
type RateLimitRecord = { count: number; resetTime: number };
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up old rate limit entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, record]) => {
    if (now > record.resetTime + CLEANUP_INTERVAL_MS) {
      rateLimitStore.delete(key);
    }
  });
}, CLEANUP_INTERVAL_MS);

// ==================== Request Validation ====================
interface GeneratePitchRequest {
  leadId: string;
  customInstructions?: string;
  tone?: 'professional' | 'enthusiastic' | 'casual';
  length?: 'short' | 'medium' | 'long';
}

// ==================== Helper Functions ====================
function formatRequirements(requirements: unknown): string {
  if (!requirements) return 'Not specified';
  if (Array.isArray(requirements)) return requirements.join(', ');
  if (typeof requirements === 'string') return requirements;
  return String(requirements);
}

// Retry wrapper for Groq API calls with exponential backoff
async function callGroqWithRetry(params: any, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await groq.chat.completions.create(params);
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      if (error.status === 429 || error.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// ==================== POST Handler ====================
export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  console.log(`[${requestId}] Generate pitch request started`);

  try {
    // ---------- Authentication ----------
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.warn(`[${requestId}] Unauthorized access attempt`);
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ---------- Rate Limiting ----------
    const now = Date.now();
    const rateLimitKey = `user:${userId}`;
    let rateLimit = rateLimitStore.get(rateLimitKey);

    if (!rateLimit) {
      rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
      rateLimitStore.set(rateLimitKey, rateLimit);
    }

    if (now > rateLimit.resetTime) {
      rateLimit.count = 0;
      rateLimit.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    if (rateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterSeconds = Math.ceil((rateLimit.resetTime - now) / 1000);
      console.warn(`[${requestId}] Rate limit exceeded for user ${userId}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.', retryAfter: retryAfterSeconds },
        { status: 429, headers: { 'Retry-After': retryAfterSeconds.toString() } }
      );
    }

    rateLimit.count++;
    rateLimitStore.set(rateLimitKey, rateLimit);

    // ---------- Parse Request Body ----------
    let body: GeneratePitchRequest;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { leadId, customInstructions, tone = 'professional', length = 'medium' } = body;

    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json({ error: 'Lead ID is required and must be a string' }, { status: 400 });
    }

    // ---------- Fetch Lead Details ----------
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error(`[${requestId}] Lead not found: ${leadId}`, leadError);
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // ---------- Fetch User Profile (including credits & skills) ----------
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_pro, credits, skills, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error(`[${requestId}] Profile fetch error:`, profileError);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // ---------- Smart Access Control: Pro OR credits > 0 ----------
    const canGenerate = profile.is_pro || (profile.credits && profile.credits > 0);
    if (!canGenerate) {
      console.warn(`[${requestId}] User ${userId} has insufficient credits and is not pro`);
      return NextResponse.json(
        { error: 'You have no credits left. Upgrade to Pro for unlimited pitches.' },
        { status: 403 }
      );
    }

    // ---------- Prepare AI Context with User's Own Skills ----------
    const userSkills = profile.skills && Array.isArray(profile.skills) ? profile.skills.join(', ') : 'your skills';
    const context = `
Job Title: ${lead.title || 'Untitled'}
Company: ${lead.company || 'Unknown'}
Location: ${lead.location || 'Remote / Not specified'}
Requirements: ${formatRequirements(lead.requirements)}
Description: ${lead.description?.substring(0, 1500) || 'No description provided.'}
User Instructions: ${customInstructions || 'None'}
Desired Tone: ${tone}
Desired Length: ${length}
User's Skills: ${userSkills}
    `.trim();

    // ---------- Advanced System Prompt (Expert-Level) ----------
    const maxTokens = length === 'short' ? 300 : length === 'long' ? 700 : 500;
    const systemPrompt = `You are an elite career coach and copywriter specializing in high‑conversion job applications. Your task is to craft a personalized pitch that makes the reader feel the candidate is the perfect fit.

Guidelines:
- Use the desired tone (${tone}) – professional, enthusiastic, or casual – but always maintain authenticity.
- Seamlessly weave the candidate's skills (provided) into the requirements of the job.
- Show deep understanding of the company's mission or industry (infer from job description).
- Include a specific, compelling example that demonstrates impact.
- End with a confident call‑to‑action (e.g., "I would love to discuss how I can contribute to your team.").

Structure:
1. Opening hook: Grab attention by addressing a challenge or goal mentioned in the description.
2. Value proposition: Align candidate's strongest skills with 2‑3 key requirements.
3. Proof of success: Briefly mention a past achievement relevant to the role.
4. Cultural fit: Express genuine enthusiasm for the company's work.
5. Closing: Clear, polite call‑to‑action.

Length: ${length === 'short' ? 'approx. 100 words' : length === 'long' ? 'approx. 300 words' : 'approx. 200 words'}.`;

    // ---------- Call Groq AI with Retry ----------
    let completion;
    try {
      completion = await callGroqWithRetry({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context },
        ],
        model: 'mixtral-8x7b-32768', // or use env var
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
        stream: false,
      });
    } catch (aiError: any) {
      console.error(`[${requestId}] Groq API error after retries:`, aiError);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const pitch = completion.choices[0]?.message?.content || '';
    if (!pitch) {
      throw new Error('AI returned empty response');
    }

    // ---------- Atomic Credit Deduction (if not pro) ----------
    if (!profile.is_pro) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', userId)
        .eq('credits', profile.credits); // optimistic concurrency check

      if (updateError) {
        console.error(`[${requestId}] Credit deduction failed:`, updateError);
        // Rollback? Not possible easily. Log and notify, but pitch already generated.
        // Option: delete the generated pitch? For now, just log.
      } else {
        console.log(`[${requestId}] Deducted 1 credit from user ${userId}`);
      }
    }

    // ---------- Log Pitch Generation ----------
    await supabase.from('pitch_generations').insert({
      user_id: userId,
      lead_id: leadId,
      pitch_content: pitch,
      tone,
      length,
      tokens_used: completion.usage?.total_tokens || 0,
      request_id: requestId,
      credits_used: profile.is_pro ? 0 : 1,
    }).then(({ error }) => {
      if (error) console.error(`[${requestId}] Failed to insert pitch log:`, error);
    });

    // ---------- Update Lead Flag (non‑critical) ----------
    await supabase
      .from('leads')
      .update({ ai_pitch_generated: true })
      .eq('id', leadId)
      .then(({ error }) => {
        if (error) console.error(`[${requestId}] Failed to update lead flag:`, error);
      });

    // ---------- Response Headers ----------
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': (RATE_LIMIT_MAX_REQUESTS - rateLimit.count).toString(),
      'X-RateLimit-Reset': rateLimit.resetTime.toString(),
    });

    // ---------- Success ----------
    console.log(`[${requestId}] Pitch generated successfully for user ${userId}`);
    return NextResponse.json(
      {
        success: true,
        pitch,
        usage: completion.usage,
        lead: {
          title: lead.title,
          company: lead.company,
          location: lead.location,
        },
        remainingCredits: profile.is_pro ? 'Unlimited' : profile.credits - 1,
      },
      { headers }
    );
  } catch (error: any) {
    console.error(`[${requestId}] Unhandled error:`, error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// ==================== GET Handler ====================
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate pitches.' },
    { status: 405 }
  );
}
