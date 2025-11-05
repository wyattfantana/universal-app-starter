import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility, defaultAbility } from './ability';

export const AbilityContext = createContext<AppAbility>(defaultAbility);
export const Can = createContextualCan(AbilityContext.Consumer);
