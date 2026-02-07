import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user as any;
      const isAdmin = user?.role === 'ADMIN';

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isHome = nextUrl.pathname === '/';

      console.log(`[Middleware] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}, Role: ${user?.role}`);

      // Protect Admin Routes
      if (isOnAdmin && nextUrl.pathname !== '/admin/login') {
        if (!isLoggedIn) return false;
        if (!isAdmin) {
          // Redirect non-admins to user dashboard
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // Protect User Routes (Dashboard/Home)
      if (isOnDashboard || isHome) {
        if (isLoggedIn) {
          if (isAdmin) {
            // Redirect admins to admin dashboard if they try to access user dashboard
            return Response.redirect(new URL('/admin/dashboard', nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      }

      // Redirect logged-in users away from login pages
      if (isLoggedIn) {
        if (nextUrl.pathname.startsWith('/signup') || nextUrl.pathname.startsWith('/login')) {
          if (isAdmin) {
            return Response.redirect(new URL('/admin/dashboard', nextUrl));
          }
          return Response.redirect(new URL('/', nextUrl));
        }
        if (nextUrl.pathname === '/admin/login') {
          if (isAdmin) {
            return Response.redirect(new URL('/admin/dashboard', nextUrl));
          }
          // If normal user tries to go to admin login, redirect to user dashboard
          return Response.redirect(new URL('/', nextUrl));
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
