import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
