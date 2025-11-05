import { useContext } from 'react';
import { AbilityContext } from '../lib/ability-context';

export function useAbility() {
  const ability = useContext(AbilityContext);

  if (!ability) {
    throw new Error('useAbility must be used within AbilityProvider');
  }

  return ability;
}
