import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'


export async function middleware(request: NextRequest) {
    console.log('Middleware called');
    console.log(`Request URL: ${request.url}`);
    console.log(`Request Pathname: ${request.nextUrl.pathname}`);


    const token = request.cookies.get('token');
    const url = request.url;
    console.log(`Token: ${token?.value}`) 

    if (!token?.value) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    
    const decoded = jwt.decode(token?.value);
    console.log(`Decoded: ${decoded}`)

   return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/home/:path*'],
};
