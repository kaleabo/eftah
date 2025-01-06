import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const isAuthPage = req.nextUrl.pathname === '/login'
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isAdmin = req.nextauth.token?.role === 'ADMIN'

    if (isAuthPage) {
      if (isAuth && isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return null
    }

    if (!isAuth && isAdminPage) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      authorized: () => true
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}