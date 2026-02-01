import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isHome = nextUrl.pathname === '/';
      const isOnPatients = nextUrl.pathname.startsWith('/patients');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');

      if (isOnDashboard || isHome || isOnPatients || isOnSettings) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (nextUrl.pathname.startsWith('/signup') || nextUrl.pathname.startsWith('/login')) {
          return Response.redirect(new URL('/', nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
