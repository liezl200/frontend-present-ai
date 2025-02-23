import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('__session');

  // List of paths that don't require authentication
  const publicPaths = ['/login'];

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If there's no auth cookie and the path isn't public, redirect to login
  if (!authCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there's an auth cookie and we're on the login page, redirect to home
  if (authCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
