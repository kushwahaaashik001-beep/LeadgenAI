import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration (in‑memory – for production use Redis)
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,    // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
};

// In‑memory rate limit store (development only)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
// In‑memory blocked IPs (development only)
const blockedIPs = new Set<string>();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // -------------------- Security & Rate Limiting --------------------
  if (blockedIPs.has(ip)) {
    return NextResponse.redirect(new URL('/blocked', req.url));
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimit = await checkRateLimit(ip);
    if (rateLimit.blocked) {
      return NextResponse.json(
        { error: RATE_LIMIT.message },
        {
          status: 429,
          headers: { 'Retry-After': rateLimit.retryAfter.toString() },
        }
      );
    }

    // Add rate limit headers
    res.headers.set('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString());
    res.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    res.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
  }

  // -------------------- Session Management --------------------
  // This refreshes the session cookie on every request
  const { data: { session } } = await supabase.auth.getSession();

  // -------------------- Route Protection --------------------
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/auth/callback',        // ✅ MUST be public – OAuth redirects land here
    '/pricing',
    '/about',
    '/privacy',
    '/terms',
    '/api/health',
    '/api/webhook',
    '/blocked',
    '/unauthorized',
  ];

  const publicApiRoutes = [
    '/api/health',
    '/api/webhook',
    '/api/generate-pitch',   // This is still protected inside the route itself
  ];

  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected pages
  if (!session) {
    if (!isPublicRoute && !isPublicApiRoute) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    // User is authenticated
    const user = session.user;

    // Redirect from auth pages to dashboard
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // ***********************************************************
    // 🛑 FIX: Email verification check removed – it was breaking login persistence
    //    because email_confirmed_at may be null for OAuth users temporarily.
    // ***********************************************************

    // (Optional) Pro subscription check for pro‑only pages
    if (pathname.startsWith('/pro-features')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro, subscription_end_date')
        .eq('id', user.id)
        .single();

      if (!profile?.is_pro || (profile.subscription_end_date && new Date(profile.subscription_end_date) < new Date())) {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    }

    // Add user info to response headers (useful for logging)
    res.headers.set('X-User-ID', user.id);
    res.headers.set('X-User-Email', user.email || '');
  }

  // -------------------- Security Headers --------------------
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // -------------------- CORS for API Routes --------------------
  if (pathname.startsWith('/api/')) {
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://leadgenai.com';
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: res.headers });
  }

  // -------------------- Basic Bot Detection --------------------
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|scraper/i.test(userAgent);
  const allowedBots = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebot', 'ia_archiver'];
  const isAllowedBot = allowedBots.some(bot => userAgent.toLowerCase().includes(bot));

  if (isBot && !isAllowedBot && !pathname.startsWith('/api/')) {
    // Block suspicious bots
    blockedIPs.add(ip);
    return NextResponse.redirect(new URL('/blocked', req.url));
  }

  // Optional request logging
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);

  return res;
}

// Rate limiting helper (in‑memory, dev only)
async function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Clean up old entries
  Array.from(rateLimitMap.entries()).forEach(([key, value]) => {
    if (value.resetTime < windowStart) rateLimitMap.delete(key);
  });

  let rateLimit = rateLimitMap.get(ip);
  if (!rateLimit) {
    rateLimit = { count: 0, resetTime: now + RATE_LIMIT.windowMs };
    rateLimitMap.set(ip, rateLimit);
  }

  if (rateLimit.resetTime < now) {
    rateLimit.count = 0;
    rateLimit.resetTime = now + RATE_LIMIT.windowMs;
  }

  rateLimit.count++;

  if (rateLimit.count > RATE_LIMIT.maxRequests) {
    // Block IP after too many violations
    if (rateLimit.count - RATE_LIMIT.maxRequests > 10) {
      blockedIPs.add(ip);
    }
    return {
      blocked: true,
      remaining: 0,
      retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000),
      resetTime: rateLimit.resetTime,
    };
  }

  return {
    blocked: false,
    remaining: Math.max(0, RATE_LIMIT.maxRequests - rateLimit.count),
    retryAfter: 0,
    resetTime: rateLimit.resetTime,
  };
}

// Match all paths except static assets and health check
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/health).*)',
  ],
};
