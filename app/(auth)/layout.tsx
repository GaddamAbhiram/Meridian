// No sidebar here on purpose - the login/signup pages are the one place a
// persistent "Log in / Sign up" sidebar would be actively confusing (you're
// already on that page). Each page's own .auth-shell handles full-viewport
// centering.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
