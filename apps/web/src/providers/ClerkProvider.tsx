import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('⚠️  Clerk Publishable Key not found. Add VITE_CLERK_PUBLISHABLE_KEY to .env');
}

interface Props {
  children: ReactNode;
}

export function ClerkProvider({ children }: Props) {
  // If no key is provided, render children without Clerk
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <BaseClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </BaseClerkProvider>
  );
}
