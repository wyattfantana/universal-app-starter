import posthog from 'posthog-js';

export function initAnalytics() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.warn('⚠️  PostHog API key not configured. Analytics disabled.');
    return;
  }

  posthog.init(apiKey, {
    api_host: host,
    // Disable in development
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.opt_out_capturing();
      }
    },
  });

  console.log('✅ PostHog analytics initialized');
}

// Helper functions
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    posthog.capture(event, properties);
  },

  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  },

  reset: () => {
    posthog.reset();
  },

  page: () => {
    posthog.capture('$pageview');
  },
};

export { posthog };
