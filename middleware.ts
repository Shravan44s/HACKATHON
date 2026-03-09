import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware for route protection hints
// Actual auth checks happen client-side via Zustand store
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/enroll' ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next();
    }

    // All other routes pass through — client-side auth guards handle the rest
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
