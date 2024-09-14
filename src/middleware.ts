import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// Middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

    //check if user is authenticated extracting the token from the request
    const token = request.cookies.get('authToken')?.value;

  const isAuthenticated = !!token;

  if (pathname.startsWith('/admin') && !isAuthenticated) {
    
    return NextResponse.redirect(new URL('/error', request.url));
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ['/admin'],
};
