import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
};

// Rate limit store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Blocked IPs (in production, use a proper database)
const blockedIPs = new Set<string>();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Check if IP is blocked
  if (blockedIPs.has(ip)) {
    return NextResponse.redirect(new URL('/blocked', req.url));
  }

  // Rate limiting
  if (pathname.startsWith('/api/')) {
    const rateLimit = await checkRateLimit(ip, req);
    if (rateLimit.blocked) {
      return NextResponse.json(
        { error: RATE_LIMIT.message },
        { status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
      );
    }

    // Add rate limit headers
    res.headers.set('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString());
    res.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    res.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
  }

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/pricing',
    '/about',
    '/privacy',
    '/terms',
    '/api/health',
    '/api/webhook',
    '/blocked',
    '/unauthorized',
  ];

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/health',
    '/api/webhook',
    '/api/generate-pitch',
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // Handle authentication
  if (!session) {
    // Redirect unauthenticated users trying to access protected routes
    if (!isPublicRoute && !isPublicApiRoute) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    // User is authenticated
    const user = session.user;
    
    // Check email verification for certain routes
    if (!user.email_confirmed_at && pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/verify-email', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check for Pro subscription on Pro-only routes
    if (pathname.startsWith('/pro-features')) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_pro, subscription_end_date')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (!profile?.is_pro || !profile.subscription_end_date) {
          return NextResponse.redirect(new URL('/pricing', req.url));
        }

        // Check if subscription is expired
        const subscriptionEnd = new Date(profile.subscription_end_date);
        if (subscriptionEnd < new Date()) {
          return NextResponse.redirect(new URL('/pricing?expired=true', req.url));
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    }

    // Add security headers
    res.headers.set('X-User-ID', user.id);
    res.headers.set('X-User-Email', user.email || '');
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    res.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'https://leadgenai.com');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: res.headers,
    });
  }

  // Bot detection and blocking
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|scraper/i.test(userAgent);
  
  if (isBot && !pathname.startsWith('/api/')) {
    // Allow search engine bots for SEO
    const allowedBots = [
      'googlebot',
      'bingbot',
      'slurp',
      'duckduckbot',
      'baiduspider',
      'yandexbot',
      'facebot',
      'ia_archiver'
    ];
    
    const isAllowedBot = allowedBots.some(bot => userAgent.toLowerCase().includes(bot));
    if (!isAllowedBot) {
      // Block suspicious bots
      blockedIPs.add(ip);
      return NextResponse.redirect(new URL('/blocked', req.url));
    }
  }

  // Request logging (for monitoring)
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);

  return res;
}

// Rate limiting function
async function checkRateLimit(ip: string, req: NextRequest) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Clean up old entries
  for (const [key, value] of Array.from(rateLimitMap.entries())) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  // Get or create rate limit entry
  let rateLimit = rateLimitMap.get(ip);
  if (!rateLimit) {
    rateLimit = { count: 0, resetTime: now + RATE_LIMIT.windowMs };
    rateLimitMap.set(ip, rateLimit);
  }

  // Check if reset time has passed
  if (rateLimit.resetTime < now) {
    rateLimit.count = 0;
    rateLimit.resetTime = now + RATE_LIMIT.windowMs;
  }

  // Increment request count
  rateLimit.count++;

  // Check if limit exceeded
  if (rateLimit.count > RATE_LIMIT.maxRequests) {
    // Add to blocked IPs if exceeding limit multiple times
    const currentCount = rateLimit.count - RATE_LIMIT.maxRequests;
    if (currentCount > 10) {
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

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/static (static files)
     * 2. /_next/image (image optimization files)
     * 3. /favicon.ico (favicon file)
     * 4. /public (public files)
     * 5. /api/health (health check)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/health).*)',
  ],
};

// Types for rate limiting
interface RateLimitResult {
  blocked: boolean;
  remaining: number;
  retryAfter: number;
  resetTime: number;
}
