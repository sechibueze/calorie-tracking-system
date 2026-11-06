export const siteConfig = {
  name: 'CalTrack',
  tagline: 'Eat smarter. Stay inside your daily goal.',
  description:
    'Log every meal in seconds, let the USDA food database fill in the calories, and see exactly which days you went over your limit.',
  routes: {
    home: '/',
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    dashboard: '/dashboard',
  },
} as const;