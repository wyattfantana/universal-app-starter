import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <ClerkSignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
