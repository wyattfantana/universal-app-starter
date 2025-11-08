import { useEffect, useState, type ReactNode } from 'react';
import { useSession } from '../lib/auth';
import { AbilityContext } from '../lib/ability-context';
import { defineAbilitiesFor, type AppAbility, type UserRole } from '../lib/ability';

interface Props {
  children: ReactNode;
}

export function AbilityProvider({ children }: Props) {
  const { data: session } = useSession();
  const [ability, setAbility] = useState<AppAbility | null>(null);

  useEffect(() => {
    if (session?.user) {
      // Get user role from Better Auth or default to 'user'
      // In the future, you can add role management to Better Auth
      const role: UserRole = 'user'; // Default role for now

      const userAbility = defineAbilitiesFor({
        id: session.user.id,
        role,
        email: session.user.email,
      });

      setAbility(userAbility);
    }
  }, [session]);

  if (!ability) {
    return <>{children}</>;
  }

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
