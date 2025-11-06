import { AbilityBuilder, Ability, type AbilityClass } from '@casl/ability';

// Define actions and subjects
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Client' | 'Estimate' | 'Invoice' | 'Product' | 'Settings' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

// Define user roles
export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  role: UserRole;
  email?: string;
}

// Define abilities for each role
export function defineAbilitiesFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  if (user.role === 'admin') {
    // Admin can do everything
    can('manage', 'all');
  } else if (user.role === 'user') {
    // User can read everything
    can('read', 'all');

    // User can manage clients
    can('create', 'Client');
    can('update', 'Client');
    can('delete', 'Client');

    // User can manage estimates
    can('create', 'Estimate');
    can('update', 'Estimate');
    can('delete', 'Estimate');

    // User can manage invoices
    can('create', 'Invoice');
    can('update', 'Invoice');
    can('delete', 'Invoice');

    // User can manage products
    can('create', 'Product');
    can('update', 'Product');
    can('delete', 'Product');

    // User cannot manage settings
    cannot('update', 'Settings');
    cannot('delete', 'Settings');
  } else if (user.role === 'viewer') {
    // Viewer can only read
    can('read', 'all');
  }

  return build();
}

// Create a default ability (no permissions)
export const defaultAbility = new AppAbility();
