import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS } from '../utils/constants';

describe('ROLE_PERMISSIONS', () => {
  it('owner has access to all pages and actions', () => {
    expect(ROLE_PERMISSIONS.owner.pages).toContain('*');
    expect(ROLE_PERMISSIONS.owner.actions).toContain('*');
  });

  it('kitchen cannot access staff page', () => {
    expect(ROLE_PERMISSIONS.kitchen.pages).not.toContain('staff');
  });

  it('cashier can accept orders', () => {
    expect(ROLE_PERMISSIONS.cashier.actions).toContain('accept_order');
  });

  it('server cannot accept orders', () => {
    expect(ROLE_PERMISSIONS.server.actions).not.toContain('accept_order');
  });
});
