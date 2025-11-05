import { ReactNode, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { AbilityContext } from '../lib/ability-context';
import { defineAbilitiesFor, AppAbility, UserRole } from '../lib/ability';

interface Props {
  children: ReactNode;
}

export function AbilityProvider({ children }: Props) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [ability, setAbility] = useState<AppAbility | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      // Get user role from Clerk metadata or default to 'user'
      const role = (user.publicMetadata?.role as UserRole) || 'user';

      const userAbility = defineAbilitiesFor({
        id: user.id,
        role,
        email: user.primaryEmailAddress?.emailAddress,
      });

      setAbility(userAbility);
    }
  }, [isSignedIn, user]);

  if (!ability) {
    return <>{children}</>;
  }

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
