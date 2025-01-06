import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = req.nextauth.token !== null
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isAdmin = req.nextauth.token?.role === 'ADMIN'

    // Redirect from login page if already authenticated
    if (isAuthPage) {
      if (isAuth && isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return null
    }

    // Redirect to login if trying to access admin pages without auth
    if (!isAuth && isAdminPage) {
      const from = req.nextUrl.pathname
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Redirect non-admin users away from admin pages
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/login']
}