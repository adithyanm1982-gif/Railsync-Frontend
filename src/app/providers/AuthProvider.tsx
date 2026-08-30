import { PropsWithChildren } from 'react';

/**
 * Auth state now hydrates synchronously inside authStore's create()
 * call (see features/auth/store/authStore.ts), so there's no
 * post-mount hydration step to run here anymore -- this previously
 * caused a race where DeptGuardRoute's first render saw
 * isAuthenticated=false and redirected to /login before the effect
 * that restored the session had a chance to run. Kept as a thin
 * pass-through in case future auth logic (token refresh, etc.) needs
 * a provider-level effect.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
