import { getToken } from 'next-auth/jwt'
import {NextRequest, NextResponse } from 'next/server'



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request});
    const url =  request.nextUrl;

    if(token &&
        (url.pathname === '/signin' || url.pathname === '/signup')){
            return NextResponse.redirect(new URL('/home', request.url))
        }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
  '/signin',
    '/signup',
    '/',
    '/verify/:path*',
  ]
}